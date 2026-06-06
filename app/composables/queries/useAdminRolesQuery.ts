import { useQuery } from '@tanstack/vue-query'
import { fetchAdminStaffRoles } from '~/api/admin-roles.api'
import { adminQueryKeys } from '~/constants/query-keys'

export function useAdminRolesQuery() {
  const adminAuth = useAdminAuthStore()
  const { can } = useAdminPermissions()

  return useQuery({
    queryKey: adminQueryKeys.roles(),
    queryFn: fetchAdminStaffRoles,
    enabled: computed(() => {
      if (!adminAuth.accessToken) return false
      if (!adminAuth.profile) return true
      return can('roles.read')
    }),
  })
}
