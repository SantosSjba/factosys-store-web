import type { NitroFetchOptions, NitroFetchRequest } from 'nitropack'
import { FetchError } from 'ofetch'
import { ApiError, isApiErrorBody } from '~/types/api'

type NitroFetchOpts = NitroFetchOptions<NitroFetchRequest>

export type ApiFetchOptions = NitroFetchOpts & {
  /** Si es false, no envía Bearer (endpoints públicos). Por defecto true. */
  auth?: boolean
}

let refreshPromise: Promise<void> | null = null

function normalizeApiError(error: unknown): never {
  if (error instanceof ApiError) {
    throw error
  }

  if (error instanceof FetchError) {
    if (isApiErrorBody(error.data)) {
      throw new ApiError(error.data)
    }

    throw new ApiError({
      statusCode: error.response?.status ?? 500,
      code: 'UNKNOWN_ERROR',
      message: error.message || 'Error de conexión con el servidor',
      details: null,
      timestamp: new Date().toISOString(),
      path: error.request?.toString() ?? '',
    })
  }

  if (error instanceof Error) {
    throw new ApiError({
      statusCode: 500,
      code: 'UNKNOWN_ERROR',
      message: error.message,
      details: null,
      timestamp: new Date().toISOString(),
      path: '',
    })
  }

  throw new ApiError({
    statusCode: 500,
    code: 'UNKNOWN_ERROR',
    message: 'Error de conexión con el servidor',
    details: null,
    timestamp: new Date().toISOString(),
    path: '',
  })
}

/**
 * Cliente HTTP con $fetch (ofetch), recomendado por Nuxt.
 * @see https://nuxt.com/docs/api/utils/dollarfetch
 */
export function useApi() {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  const client = $fetch.create({
    baseURL: config.public.apiBaseUrl.replace(/\/$/, ''),
    headers: {
      Accept: 'application/json',
    },
  })

  function buildNitroOptions(options: ApiFetchOptions): NitroFetchOpts {
    const { auth = true, headers, ...fetchOptions } = options
    const mergedHeaders = new Headers(headers as HeadersInit | undefined)

    if (auth && authStore.accessToken) {
      mergedHeaders.set('Authorization', `Bearer ${authStore.accessToken}`)
    }

    return {
      ...fetchOptions,
      headers: mergedHeaders,
    }
  }

  async function request<T>(
    path: string,
    options: ApiFetchOptions = {},
  ): Promise<T> {
    const { auth = true } = options
    const nitroOptions = buildNitroOptions(options)

    try {
      return await client<T>(path, nitroOptions)
    } catch (error) {
      if (
        error instanceof FetchError &&
        error.response?.status === 401 &&
        auth &&
        authStore.refreshToken
      ) {
        if (!refreshPromise) {
          refreshPromise = authStore
            .refreshSession()
            .then(() => undefined)
            .finally(() => {
              refreshPromise = null
            })
        }

        try {
          await refreshPromise
          return await client<T>(path, buildNitroOptions(options))
        } catch (retryError) {
          authStore.clearSession()
          normalizeApiError(retryError)
        }
      }

      normalizeApiError(error)
    }
  }

  return request
}
