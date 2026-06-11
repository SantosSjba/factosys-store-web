import axios, { type AxiosInstance } from 'axios'
import type { ApiAxiosRequestConfig } from '~/types/axios'
import { parseApiError } from '~/utils/parse-api-error'

type TokenAccessor = {
  getAccessToken: () => string | null | undefined
  getRefreshToken: () => string | null | undefined
  refreshSession: () => Promise<void>
  clearSession: () => void
}

export function createAxiosClient(tokenAccessor: TokenAccessor): AxiosInstance {
  const config = useRuntimeConfig()
  let refreshPromise: Promise<void> | null = null

  const client = axios.create({
    baseURL: config.public.apiBaseUrl.replace(/\/$/, ''),
    timeout: 30_000,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })

  client.interceptors.request.use((request) => {
    const cfg = request as ApiAxiosRequestConfig
    const useAuth = cfg.withAuth !== false
    const accessToken = tokenAccessor.getAccessToken()

    if (useAuth && accessToken) {
      request.headers.set('Authorization', `Bearer ${accessToken}`)
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
          tokenAccessor.clearSession()
          return Promise.reject(parseApiError(retryError))
        }
      }

      return Promise.reject(parseApiError(error))
    },
  )

  return client
}
