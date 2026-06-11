import { useQuery } from '@tanstack/vue-query'
import { fetchStoreCart, fetchStoreCartCount } from '~/api/store-cart.api'
import { storeQueryKeys } from '~/constants/query-keys'
import type { StoreCart } from '~/types/store-cart'

export function useStoreCartQuery() {
  const authStore = useAuthStore()

  return useQuery<StoreCart>({
    queryKey: storeQueryKeys.cart(),
    queryFn: fetchStoreCart,
    enabled: computed(() => authStore.isAuthenticated),
    staleTime: 30_000,
  })
}

export function useStoreCartCountQuery() {
  const authStore = useAuthStore()

  return useQuery<number>({
    queryKey: storeQueryKeys.cartCount(),
    queryFn: fetchStoreCartCount,
    enabled: computed(() => authStore.isAuthenticated),
    staleTime: 30_000,
  })
}
