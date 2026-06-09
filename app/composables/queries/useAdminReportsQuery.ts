import { useQuery } from '@tanstack/vue-query'
import {
  fetchAdminInventoryValuationReport,
  fetchAdminMarginReport,
  fetchAdminSalesReport,
  fetchAdminTopProducts,
} from '~/api/admin-reports.api'
import { adminQueryKeys } from '~/constants/query-keys'
import type { SalesReportParams } from '~/types/admin-reports'

export function useAdminSalesReportQuery(
  params: MaybeRefOrGetter<SalesReportParams> = {},
) {
  const adminAuth = useAdminAuthStore()
  const { can } = useAdminPermissions()

  const queryParams = computed(() => toValue(params))

  return useQuery({
    queryKey: computed(() => [...adminQueryKeys.reports(), 'sales', queryParams.value]),
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
    queryKey: computed(() => [...adminQueryKeys.reports(), 'top-products', queryParams.value]),
    queryFn: () => fetchAdminTopProducts(queryParams.value),
    enabled: computed(() => {
      if (!adminAuth.accessToken) return false
      if (!adminAuth.profile) return true
      return can('reports.read')
    }),
    staleTime: 60_000,
  })
}

export function useAdminMarginReportQuery(
  params: MaybeRefOrGetter<SalesReportParams> = {},
) {
  const adminAuth = useAdminAuthStore()
  const { can } = useAdminPermissions()
  const queryParams = computed(() => toValue(params))

  return useQuery({
    queryKey: computed(() => [...adminQueryKeys.reports(), 'margin', queryParams.value]),
    queryFn: () => fetchAdminMarginReport(queryParams.value),
    enabled: computed(() => {
      if (!adminAuth.accessToken) return false
      if (!adminAuth.profile) return true
      return can('reports.read')
    }),
    staleTime: 60_000,
  })
}

export function useAdminInventoryValuationQuery() {
  const adminAuth = useAdminAuthStore()
  const { can } = useAdminPermissions()

  return useQuery({
    queryKey: [...adminQueryKeys.reports(), 'inventory-valuation'],
    queryFn: fetchAdminInventoryValuationReport,
    enabled: computed(() => {
      if (!adminAuth.accessToken) return false
      if (!adminAuth.profile) return true
      return can('reports.read')
    }),
    staleTime: 60_000,
  })
}
