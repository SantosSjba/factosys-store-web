import type { DashboardStats, DashboardStatsParams } from '~/types/admin-dashboard'

export async function fetchAdminDashboardStats(params: DashboardStatsParams = {}) {
  const { data } = await useAdminApi().get<DashboardStats>('/admin/dashboard/stats', {
    params,
  })
  return data
}
