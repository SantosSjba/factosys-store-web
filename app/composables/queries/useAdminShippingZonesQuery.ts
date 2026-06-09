import { useQuery } from '@tanstack/vue-query'
import { fetchAdminShippingZones } from '~/api/admin-shipping-zones.api'
import { adminQueryKeys } from '~/constants/query-keys'

export function useAdminShippingZonesQuery() {
  const adminAuth = useAdminAuthStore()
  const { can } = useAdminPermissions()

  return useQuery({
    queryKey: adminQueryKeys.shippingZones(),
    queryFn: fetchAdminShippingZones,
    enabled: computed(() => {
      if (!adminAuth.accessToken) return false
      if (!adminAuth.profile) return true
      return can('settings.read')
    }),
  })
}
