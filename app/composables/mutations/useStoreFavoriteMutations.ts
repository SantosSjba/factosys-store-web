import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { addStoreFavorite, removeStoreFavorite } from '~/api/store-favorites.api'
import { storeQueryKeys } from '~/constants/query-keys'

export function useToggleStoreFavoriteMutation() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: async ({
      productId,
      isFavorite,
    }: {
      productId: string
      isFavorite: boolean
    }) => {
      if (isFavorite) {
        await removeStoreFavorite(productId)
        return false
      }

      await addStoreFavorite(productId)
      return true
    },
    onMutate: async ({ productId, isFavorite }) => {
      await queryClient.cancelQueries({ queryKey: storeQueryKeys.favoriteIds() })

      const previousIds = queryClient.getQueryData<string[]>(
        storeQueryKeys.favoriteIds(),
      )

      queryClient.setQueryData<string[]>(storeQueryKeys.favoriteIds(), (current) => {
        const list = current ?? []
        if (isFavorite) {
          return list.filter((id) => id !== productId)
        }
        return [productId, ...list.filter((id) => id !== productId)]
      })

      queryClient.setQueryData<number>(storeQueryKeys.favoritesCount(), (current) => {
        const count = current ?? 0
        return isFavorite ? Math.max(0, count - 1) : count + 1
      })

      return { previousIds }
    },
    onError: (error, _variables, context) => {
      if (context?.previousIds) {
        queryClient.setQueryData(storeQueryKeys.favoriteIds(), context.previousIds)
      }
      queryClient.invalidateQueries({ queryKey: storeQueryKeys.favoritesCount() })
      toast.error(useApiErrorMessage(error))
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: storeQueryKeys.favorites() })
      queryClient.invalidateQueries({ queryKey: storeQueryKeys.favoriteIds() })
      queryClient.invalidateQueries({ queryKey: storeQueryKeys.favoritesCount() })
    },
  })
}
