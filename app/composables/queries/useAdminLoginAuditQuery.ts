import { useQuery } from '@tanstack/vue-query'
import { fetchAdminLoginAudit } from '~/api/admin-auth.api'
import { adminQueryKeys } from '~/constants/query-keys'

export function useAdminLoginAuditQuery() {
  const adminAuth = useAdminAuthStore()
  const { can } = useAdminPermissions()

  return useQuery({
    queryKey: adminQueryKeys.loginAudit(),
    queryFn: fetchAdminLoginAudit,
    enabled: computed(() => {
      if (!adminAuth.accessToken) return false
      if (!adminAuth.profile) return true
      return can('users.read')
    }),
    staleTime: 30_000,
  })
}
