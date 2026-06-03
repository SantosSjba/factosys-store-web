import type { FetchOptions } from 'ofetch'
import { ApiError, isApiErrorBody } from '~/types/api'

type ApiFetchOptions = FetchOptions<'json'> & {
  /** Si es false, no envía Bearer (endpoints públicos). Por defecto true. */
  auth?: boolean
}

let refreshPromise: Promise<void> | null = null

export function useApi() {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  async function parseError(response: Response): Promise<never> {
    let body: unknown = null
    try {
      body = await response.json()
    } catch {
      body = null
    }
    if (isApiErrorBody(body)) {
      throw new ApiError(body)
    }
    throw new ApiError({
      statusCode: response.status,
      code: 'UNKNOWN_ERROR',
      message: response.statusText || 'Error de conexión con el servidor',
      details: null,
      timestamp: new Date().toISOString(),
      path: response.url,
    })
  }

  async function request<T>(
    path: string,
    options: ApiFetchOptions = {},
  ): Promise<T> {
    const { auth = true, ...fetchOptions } = options
    const headers = new Headers(
      (fetchOptions.headers as HeadersInit | undefined) ?? {},
    )
    headers.set('Accept', 'application/json')
    if (!(fetchOptions.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json')
    }
    if (auth && authStore.accessToken) {
      headers.set('Authorization', `Bearer ${authStore.accessToken}`)
    }

    const url = path.startsWith('http')
      ? path
      : `${config.public.apiBaseUrl}${path.startsWith('/') ? path : `/${path}`}`

    const response = await fetch(url, {
      ...fetchOptions,
      headers,
      body:
        fetchOptions.body !== undefined &&
        typeof fetchOptions.body === 'object' &&
        !(fetchOptions.body instanceof FormData)
          ? JSON.stringify(fetchOptions.body)
          : (fetchOptions.body as BodyInit | undefined),
    })

    if (response.status === 401 && auth && authStore.refreshToken) {
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
        return request<T>(path, options)
      } catch {
        authStore.clearSession()
        await parseError(response)
      }
    }

    if (!response.ok) {
      await parseError(response)
    }

    if (response.status === 204) {
      return undefined as T
    }

    return (await response.json()) as T
  }

  return request
}
