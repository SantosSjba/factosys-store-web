import { useQuery } from '@tanstack/vue-query'
import { fetchStoreAddresses } from '~/api/store-profile.api'
import { storeQueryKeys } from '~/constants/query-keys'
import type { CustomerSavedAddress } from '~/types/admin-customers'

export function useStoreAddressesQuery() {
  const authStore = useAuthStore()

  return useQuery<CustomerSavedAddress[]>({
    queryKey: storeQueryKeys.addresses(),
    queryFn: () => fetchStoreAddresses(),
    enabled: computed(() => Boolean(authStore.accessToken)),
    staleTime: 60 * 1000,
  })
}
