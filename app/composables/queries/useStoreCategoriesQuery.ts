import { useQuery } from '@tanstack/vue-query'
import { fetchStoreCategoryTree } from '~/api/store-catalog.api'
import { storeQueryKeys } from '~/constants/query-keys'
import type { StoreCategoryNode } from '~/types/store'

export function useStoreCategoriesQuery() {
  return useQuery<StoreCategoryNode[]>({
    queryKey: storeQueryKeys.categories(),
    queryFn: (): Promise<StoreCategoryNode[]> => fetchStoreCategoryTree(),
    staleTime: 5 * 60 * 1000,
  })
}
