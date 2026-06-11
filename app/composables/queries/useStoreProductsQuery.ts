import { useQuery } from '@tanstack/vue-query'
import {
  fetchStoreProductBySlug,
  fetchStoreProducts,
} from '~/api/store-catalog.api'
import { storeQueryKeys } from '~/constants/query-keys'
import type { PaginatedResponse } from '~/types/pagination'
import type { ListStoreProductsParams, StoreProduct } from '~/types/store'

export function useStoreProductsQuery(
  params: MaybeRefOrGetter<ListStoreProductsParams> = {},
) {
  const queryParams = computed(() => {
    const raw = toValue(params)
    return {
      page: raw.page ?? 1,
      limit: raw.limit ?? 12,
      search: raw.search?.trim() || undefined,
      categoryId: raw.categoryId,
      brandId: raw.brandId,
    }
  })

  return useQuery<PaginatedResponse<StoreProduct>>({
    queryKey: computed(() => [...storeQueryKeys.products(), queryParams.value]),
    queryFn: (): Promise<PaginatedResponse<StoreProduct>> =>
      fetchStoreProducts(queryParams.value),
    staleTime: 60 * 1000,
  })
}

export function useStoreProductQuery(slug: MaybeRefOrGetter<string>) {
  const resolvedSlug = computed(() => toValue(slug).trim())

  return useQuery<StoreProduct>({
    queryKey: computed(() => storeQueryKeys.product(resolvedSlug.value)),
    queryFn: (): Promise<StoreProduct> =>
      fetchStoreProductBySlug(resolvedSlug.value),
    enabled: computed(() => resolvedSlug.value.length > 0),
    staleTime: 60 * 1000,
  })
}
