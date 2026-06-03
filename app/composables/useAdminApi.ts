import type { AxiosInstance } from 'axios'
import { createAxiosClient } from '~/utils/create-axios-client'

const ADMIN_API_KEY = 'admin-axios-client'

/** Cliente HTTP intranet / panel admin (Axios). */
export function useAdminApi(): AxiosInstance {
  const client = useState<AxiosInstance | null>(ADMIN_API_KEY, () => null)
  const adminAuth = useAdminAuthStore()

  if (!client.value) {
    client.value = createAxiosClient({
      getAccessToken: () => adminAuth.accessToken,
      getRefreshToken: () => adminAuth.refreshToken,
      refreshSession: async () => {
        await adminAuth.refreshSession()
      },
      clearSession: () => adminAuth.clearSession(),
    })
  }

  return client.value
}
