import type { DashboardStats } from '~/types/admin-dashboard'

export async function fetchAdminDashboardStats() {
  const { data } = await useAdminApi().get<DashboardStats>('/admin/dashboard/stats')
  return data
}
