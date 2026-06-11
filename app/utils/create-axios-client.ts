import axios, { type AxiosInstance } from 'axios'
import https from 'node:https'
import type { ApiAxiosRequestConfig } from '~/types/axios'
import { parseApiError } from '~/utils/parse-api-error'

type TokenAccessor = {
  getAccessToken: () => string | null | undefined
  getRefreshToken: () => string | null | undefined
  getGuestCartToken?: () => string | null | undefined
  refreshSession: () => Promise<void>
  clearSession: () => void
}

function resolveApiBaseUrl() {
  const config = useRuntimeConfig()
  const apiPath = config.public.apiBaseUrl.replace(/\/$/, '')

  if (apiPath.startsWith('http')) return apiPath

  if (import.meta.server) {
    const event = useRequestEvent()
    const host = event?.node.req.headers.host

    if (host) {
      const forwardedProto = event?.node.req.headers['x-forwarded-proto']
      const proto =
        typeof forwardedProto === 'string' ? forwardedProto.split(',')[0] : 'http'

      return `${proto}://${host}${apiPath.startsWith('/') ? apiPath : `/${apiPath}`}`
    }

    const origin = String(config.public.apiOrigin || '').replace(/\/$/, '')
    if (origin) {
      return `${origin}${apiPath.startsWith('/') ? apiPath : `/${apiPath}`}`
    }
  }

  return apiPath
}

function resolveHttpsAgent(baseURL: string) {
  if (!import.meta.server || !baseURL.startsWith('https://')) return undefined

  return new https.Agent({ rejectUnauthorized: false })
}

export function createAxiosClient(tokenAccessor: TokenAccessor): AxiosInstance {
  let refreshPromise: Promise<void> | null = null
  const baseURL = resolveApiBaseUrl()

  const client = axios.create({
    baseURL,
    timeout: 30_000,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    httpsAgent: resolveHttpsAgent(baseURL),
  })

  client.interceptors.request.use((request) => {
    const cfg = request as ApiAxiosRequestConfig
    const useAuth = cfg.withAuth !== false
    const accessToken = tokenAccessor.getAccessToken()

    if (useAuth && accessToken) {
      request.headers.set('Authorization', `Bearer ${accessToken}`)
    } else {
      const guestCartToken = tokenAccessor.getGuestCartToken?.()?.trim()
      if (guestCartToken) {
        request.headers.set('X-Guest-Cart-Token', guestCartToken)
      }
    }

    return request
  })

  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config as ApiAxiosRequestConfig | undefined

      if (
        error.response?.status === 401 &&
        originalRequest &&
        originalRequest.withAuth !== false &&
        !originalRequest.skipRefresh &&
        !originalRequest._retry &&
        tokenAccessor.getRefreshToken()
      ) {
        originalRequest._retry = true

        if (!refreshPromise) {
          refreshPromise = tokenAccessor
            .refreshSession()
            .finally(() => {
              refreshPromise = null
            })
        }

        try {
          await refreshPromise
          const accessToken = tokenAccessor.getAccessToken()
          if (accessToken) {
            originalRequest.headers.set('Authorization', `Bearer ${accessToken}`)
          }
          return client(originalRequest)
        } catch (retryError) {
          const apiError = parseApiError(retryError)
          if (apiError.statusCode === 401 || apiError.statusCode === 403) {
            tokenAccessor.clearSession()
          }
          return Promise.reject(apiError)
        }
      }

      return Promise.reject(parseApiError(error))
    },
  )

  return client
}
