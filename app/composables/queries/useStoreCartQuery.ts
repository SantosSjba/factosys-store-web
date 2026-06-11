import { useQuery } from '@tanstack/vue-query'
import { fetchStoreCart, fetchStoreCartCount } from '~/api/store-cart.api'
import { storeQueryKeys } from '~/constants/query-keys'
import type { StoreCart } from '~/types/store-cart'

export function useStoreCartQuery() {
  const canUseCart = useCanUseStoreCart()

  return useQuery<StoreCart>({
    queryKey: storeQueryKeys.cart(),
    queryFn: fetchStoreCart,
    enabled: canUseCart,
    staleTime: 30_000,
  })
}

export function useStoreCartCountQuery() {
  const canUseCart = useCanUseStoreCart()

  return useQuery<number>({
    queryKey: storeQueryKeys.cartCount(),
    queryFn: fetchStoreCartCount,
    enabled: canUseCart,
    staleTime: 30_000,
  })
}
