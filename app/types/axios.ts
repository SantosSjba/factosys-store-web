import type { InternalAxiosRequestConfig } from 'axios'

export type ApiAxiosRequestConfig = InternalAxiosRequestConfig & {
  /** Si es false, no envía Bearer. Por defecto true. */
  withAuth?: boolean
  /** Evita reintentar refresh en cadena (p. ej. POST /auth/refresh). */
  skipRefresh?: boolean
  /** Marca interna de reintento tras refresh. */
  _retry?: boolean
}

declare module 'axios' {
  export interface AxiosRequestConfig {
    withAuth?: boolean
    skipRefresh?: boolean
    _retry?: boolean
  }
}
