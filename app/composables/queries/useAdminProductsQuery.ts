import { useQuery } from '@tanstack/vue-query'
import { fetchAdminProducts } from '~/api/admin-catalog.api'
import { adminQueryKeys } from '~/constants/query-keys'
import type { ListProductsParams } from '~/types/admin-catalog'

export function useAdminProductsQuery(
  params: MaybeRefOrGetter<ListProductsParams> = {},
) {
  const adminAuth = useAdminAuthStore()
  const { can } = useAdminPermissions()

  const queryParams = computed(() => {
    const raw = toValue(params)
    return {
      page: raw.page ?? 1,
      limit: raw.limit ?? 10,
      search: raw.search?.trim() || undefined,
      categoryId: raw.categoryId,
      brandId: raw.brandId,
      status: raw.status,
    }
  })

  return useQuery({
    queryKey: computed(() => [...adminQueryKeys.products(), queryParams.value]),
    queryFn: () => fetchAdminProducts(queryParams.value),
    enabled: computed(() => {
      if (!adminAuth.accessToken) return false
      if (!adminAuth.profile) return true
      return can('products.read')
    }),
  })
}
