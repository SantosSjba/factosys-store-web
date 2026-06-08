import { fetchAdminDashboardStats } from '~/api/admin-dashboard.api'

export function useAdminDashboardQuery() {
  return useQuery({
    queryKey: ['admin', 'dashboard', 'stats'],
    queryFn: fetchAdminDashboardStats,
    staleTime: 60_000,
  })
}
