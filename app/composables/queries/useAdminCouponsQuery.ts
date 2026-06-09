import { useQuery } from '@tanstack/vue-query'
import { fetchAdminCouponStats, fetchAdminCoupons } from '~/api/admin-coupons.api'
import { adminQueryKeys } from '~/constants/query-keys'
import type { PaginationParams } from '~/types/pagination'

export function useAdminCouponStatsQuery() {
  const adminAuth = useAdminAuthStore()
  const { can } = useAdminPermissions()

  return useQuery({
    queryKey: [...adminQueryKeys.coupons(), 'stats'],
    queryFn: fetchAdminCouponStats,
    enabled: computed(() => {
      if (!adminAuth.accessToken) return false
      if (!adminAuth.profile) return true
      return can('coupons.read')
    }),
    staleTime: 30_000,
  })
}

export function useAdminCouponsQuery(
  params: MaybeRefOrGetter<PaginationParams> = {},
) {
  const adminAuth = useAdminAuthStore()
  const { can } = useAdminPermissions()

  const queryParams = computed(() => {
    const raw = toValue(params)
    return {
      page: raw.page ?? 1,
      limit: raw.limit ?? 10,
      search: raw.search?.trim() || undefined,
    }
  })

  return useQuery({
    queryKey: computed(() => [...adminQueryKeys.coupons(), queryParams.value]),
    queryFn: () => fetchAdminCoupons(queryParams.value),
    enabled: computed(() => {
      if (!adminAuth.accessToken) return false
      if (!adminAuth.profile) return true
      return can('coupons.read')
    }),
  })
}
