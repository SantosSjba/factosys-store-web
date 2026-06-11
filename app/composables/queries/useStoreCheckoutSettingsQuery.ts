import { useQuery } from '@tanstack/vue-query'
import { fetchStoreCheckoutSettings } from '~/api/store-checkout.api'
import { storeQueryKeys } from '~/constants/query-keys'
import type { StoreCheckoutSettings } from '~/types/store-checkout'

export function useStoreCheckoutSettingsQuery() {
  return useQuery<StoreCheckoutSettings, Error>({
    queryKey: storeQueryKeys.checkoutSettings(),
    queryFn: fetchStoreCheckoutSettings,
    staleTime: 5 * 60 * 1000,
  })
}
