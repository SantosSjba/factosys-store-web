import { useQuery } from '@tanstack/vue-query'
import { fetchAdminSalesReport, fetchAdminTopProducts } from '~/api/admin-reports.api'
import type { SalesReportParams } from '~/types/admin-reports'

export function useAdminSalesReportQuery(
  params: MaybeRefOrGetter<SalesReportParams> = {},
) {
  const adminAuth = useAdminAuthStore()
  const { can } = useAdminPermissions()

  const queryParams = computed(() => toValue(params))

  return useQuery({
    queryKey: computed(() => ['admin', 'reports', 'sales', queryParams.value]),
    queryFn: () => fetchAdminSalesReport(queryParams.value),
    enabled: computed(() => {
      if (!adminAuth.accessToken) return false
      if (!adminAuth.profile) return true
      return can('reports.read')
    }),
    staleTime: 60_000,
  })
}

export function useAdminTopProductsQuery(
  params: MaybeRefOrGetter<SalesReportParams & { limit?: number }> = {},
) {
  const adminAuth = useAdminAuthStore()
  const { can } = useAdminPermissions()

  const queryParams = computed(() => toValue(params))

  return useQuery({
    queryKey: computed(() => ['admin', 'reports', 'top-products', queryParams.value]),
    queryFn: () => fetchAdminTopProducts(queryParams.value),
    enabled: computed(() => {
      if (!adminAuth.accessToken) return false
      if (!adminAuth.profile) return true
      return can('reports.read')
    }),
    staleTime: 60_000,
  })
}
