import { useMutation, useQueryClient } from '@tanstack/vue-query'
import {
  addStoreCartItem,
  clearStoreCart,
  removeStoreCartItem,
  updateStoreCartItem,
} from '~/api/store-cart.api'
import { storeQueryKeys } from '~/constants/query-keys'
import type { StoreCart } from '~/types/store-cart'

function syncCartCache(queryClient: ReturnType<typeof useQueryClient>, cart: StoreCart) {
  queryClient.setQueryData(storeQueryKeys.cart(), cart)
  queryClient.setQueryData(storeQueryKeys.cartCount(), cart.itemCount)
}

export function useAddStoreCartItemMutation() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: addStoreCartItem,
    onSuccess: (cart) => {
      syncCartCache(queryClient, cart)
      toast.success('Producto agregado al carrito')
    },
    onError: (error) => {
      toast.error(useApiErrorMessage(error))
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: storeQueryKeys.cart() })
      queryClient.invalidateQueries({ queryKey: storeQueryKeys.cartCount() })
    },
  })
}

export function useUpdateStoreCartItemMutation() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: ({
      variantId,
      quantity,
    }: {
      variantId: string
      quantity: number
    }) => updateStoreCartItem(variantId, { quantity }),
    onMutate: async ({ variantId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: storeQueryKeys.cart() })

      const previousCart = queryClient.getQueryData<StoreCart>(storeQueryKeys.cart())

      if (previousCart) {
        const nextItems =
          quantity <= 0
            ? previousCart.items.filter((item) => item.variantId !== variantId)
            : previousCart.items.map((item) =>
                item.variantId === variantId
                  ? {
                      ...item,
                      quantity,
                      lineSubtotal: item.unitPrice * quantity,
                    }
                  : item,
              )

        syncCartCache(queryClient, {
          ...previousCart,
          items: nextItems,
          itemCount: nextItems.reduce((sum, item) => sum + item.quantity, 0),
          subtotal: nextItems.reduce((sum, item) => sum + item.lineSubtotal, 0),
        })
      }

      return { previousCart }
    },
    onError: (error, _variables, context) => {
      if (context?.previousCart) {
        syncCartCache(queryClient, context.previousCart)
      }
      toast.error(useApiErrorMessage(error))
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: storeQueryKeys.cart() })
      queryClient.invalidateQueries({ queryKey: storeQueryKeys.cartCount() })
    },
  })
}

export function useRemoveStoreCartItemMutation() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: (variantId: string) => removeStoreCartItem(variantId),
    onSuccess: (cart) => {
      syncCartCache(queryClient, cart)
    },
    onError: (error) => {
      toast.error(useApiErrorMessage(error))
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: storeQueryKeys.cart() })
      queryClient.invalidateQueries({ queryKey: storeQueryKeys.cartCount() })
    },
  })
}

export function useClearStoreCartMutation() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: clearStoreCart,
    onSuccess: (cart) => {
      syncCartCache(queryClient, cart)
      toast.success('Carrito vaciado')
    },
    onError: (error) => {
      toast.error(useApiErrorMessage(error))
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: storeQueryKeys.cart() })
      queryClient.invalidateQueries({ queryKey: storeQueryKeys.cartCount() })
    },
  })
}
