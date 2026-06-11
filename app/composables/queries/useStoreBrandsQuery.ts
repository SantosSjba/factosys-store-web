import { useQuery } from '@tanstack/vue-query'
import { fetchStoreBrands } from '~/api/store-catalog.api'
import { storeQueryKeys } from '~/constants/query-keys'
import type { CatalogBrand } from '~/types/admin-catalog'

export function useStoreBrandsQuery() {
  return useQuery<CatalogBrand[]>({
    queryKey: storeQueryKeys.brands(),
    queryFn: fetchStoreBrands,
    staleTime: 5 * 60 * 1000,
  })
}
