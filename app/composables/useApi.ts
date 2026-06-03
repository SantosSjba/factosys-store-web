import type { AxiosInstance } from 'axios'
import { createAxiosClient } from '~/utils/create-axios-client'

const STORE_API_KEY = 'store-axios-client'

/**
 * Cliente HTTP tienda (Axios).
 * Bearer, refresh en 401 y errores tipados como `ApiError`.
 */
export function useApi(): AxiosInstance {
  const client = useState<AxiosInstance | null>(STORE_API_KEY, () => null)
  const authStore = useAuthStore()

  if (!client.value) {
    client.value = createAxiosClient({
      getAccessToken: () => authStore.accessToken,
      getRefreshToken: () => authStore.refreshToken,
      refreshSession: async () => {
        await authStore.refreshSession()
      },
      clearSession: () => authStore.clearSession(),
    })
  }

  return client.value
}
