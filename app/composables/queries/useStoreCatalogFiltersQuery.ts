import { useQuery } from '@tanstack/vue-query'
import { fetchStoreCatalogFilters } from '~/api/store-catalog.api'
import { storeQueryKeys } from '~/constants/query-keys'
import type {
  ListStoreCatalogFiltersParams,
  StoreCatalogFiltersResponse,
} from '~/types/store'

export function useStoreCatalogFiltersQuery(
  params: MaybeRefOrGetter<ListStoreCatalogFiltersParams> = {},
  options?: { enabled?: MaybeRefOrGetter<boolean> },
) {
  const queryParams = computed(() => {
    const raw = toValue(params)
    return {
      categoryId: raw.categoryId,
      brandId: raw.brandId,
      search: raw.search?.trim() || undefined,
      attrs: raw.attrs,
    }
  })

  return useQuery<StoreCatalogFiltersResponse>({
    queryKey: computed(() =>
      storeQueryKeys.catalogFilters(queryParams.value),
    ),
    queryFn: (): Promise<StoreCatalogFiltersResponse> =>
      fetchStoreCatalogFilters(queryParams.value),
    enabled: computed(() =>
      options?.enabled === undefined ? true : toValue(options.enabled),
    ),
    staleTime: 60 * 1000,
  })
}
