import type { AxiosInstance } from 'axios'
import { createAxiosClient } from '~/utils/create-axios-client'

let clientSingleton: AxiosInstance | null = null

/**
 * Cliente HTTP tienda (Axios).
 * Bearer, refresh en 401 y errores tipados como `ApiError`.
 */
export function useApi(): AxiosInstance {
  const authStore = useAuthStore()

  const createClient = () =>
    createAxiosClient({
      getAccessToken: () => authStore.accessToken,
      getRefreshToken: () => authStore.refreshToken,
      refreshSession: async () => {
        await authStore.refreshSession()
      },
      clearSession: () => authStore.clearSession(),
    })

  if (import.meta.server) {
    return createClient()
  }

  if (!clientSingleton) {
    clientSingleton = createClient()
  }

  return clientSingleton
}
