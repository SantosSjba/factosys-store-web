import { useQuery } from '@tanstack/vue-query'
import { fetchAdminDashboardStats } from '~/api/admin-dashboard.api'
import type { DashboardStatsParams } from '~/types/admin-dashboard'

export function useAdminDashboardQuery(
  range: MaybeRefOrGetter<DashboardStatsParams> = {},
) {
  const adminAuth = useAdminAuthStore()
  const { can } = useAdminPermissions()

  const queryParams = computed(() => {
    const raw = toValue(range)
    return {
      dateFrom: raw.dateFrom || undefined,
      dateTo: raw.dateTo || undefined,
    }
  })

  return useQuery({
    queryKey: computed(() => ['admin', 'dashboard', 'stats', queryParams.value]),
    queryFn: () => fetchAdminDashboardStats(queryParams.value),
    enabled: computed(() => {
      if (!adminAuth.accessToken) return false
      if (!adminAuth.profile) return true
      return can('reports.read')
    }),
    staleTime: 60_000,
  })
}
