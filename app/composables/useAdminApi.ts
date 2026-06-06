import type { AxiosInstance } from 'axios'
import { createAxiosClient } from '~/utils/create-axios-client'

let clientSingleton: AxiosInstance | null = null

/** Cliente HTTP intranet / panel admin (Axios). */
export function useAdminApi(): AxiosInstance {
  const adminAuth = useAdminAuthStore()

  const createClient = () =>
    createAxiosClient({
      getAccessToken: () => adminAuth.accessToken,
      getRefreshToken: () => adminAuth.refreshToken,
      refreshSession: async () => {
        await adminAuth.refreshSession()
      },
      clearSession: () => adminAuth.clearSession(),
    })

  // SSR: instancia efímera (Axios no es serializable en el payload de Nuxt)
  if (import.meta.server) {
    return createClient()
  }

  if (!clientSingleton) {
    clientSingleton = createClient()
  }

  return clientSingleton
}
