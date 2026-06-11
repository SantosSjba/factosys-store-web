import { useQuery } from '@tanstack/vue-query'
import { fetchStorePublicSettings } from '~/api/store-settings.api'
import { storeQueryKeys } from '~/constants/query-keys'
import type { StorePublicSettings } from '~/types/store'

export function useStoreSettingsQuery() {
  return useQuery<StorePublicSettings, Error>({
    queryKey: storeQueryKeys.settings(),
    queryFn: (): Promise<StorePublicSettings> => fetchStorePublicSettings(),
    staleTime: 5 * 60 * 1000,
  })
}
