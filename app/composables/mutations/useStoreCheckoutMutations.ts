import { useMutation, useQueryClient } from '@tanstack/vue-query'
import {
  fetchStoreCheckoutQuote,
  placeStoreOrder,
} from '~/api/store-checkout.api'
import { storeQueryKeys } from '~/constants/query-keys'
import type {
  StoreCheckoutQuotePayload,
  StorePlaceOrderPayload,
} from '~/types/store-checkout'

export function useStoreCheckoutQuoteMutation() {
  return useMutation({
    mutationFn: (payload: StoreCheckoutQuotePayload) =>
      fetchStoreCheckoutQuote(payload),
  })
}

export function useStorePlaceOrderMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: StorePlaceOrderPayload) => placeStoreOrder(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: storeQueryKeys.cart() })
      queryClient.invalidateQueries({ queryKey: storeQueryKeys.cartCount() })
      queryClient.invalidateQueries({ queryKey: storeQueryKeys.orders() })
    },
  })
}
