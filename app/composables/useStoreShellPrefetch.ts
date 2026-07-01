import { useQueryClient } from '@tanstack/vue-query'
import { fetchStoreCartCount } from '~/api/store-cart.api'
import { fetchStoreFavoritesCount } from '~/api/store-favorites.api'
import { fetchStorePublicSettings } from '~/api/store-settings.api'
import { storeQueryKeys } from '~/constants/query-keys'

const SHELL_PREFETCH_ONCE_KEY = 'store-shell-prefetch'

export function useStoreShellPrefetch() {
  const nuxtApp = useNuxtApp()

  return callOnce(SHELL_PREFETCH_ONCE_KEY, () =>
    nuxtApp.runWithContext(async () => {
      const queryClient = useQueryClient()

      try {
        await queryClient.fetchQuery({
          queryKey: storeQueryKeys.settings(),
          queryFn: () => fetchStorePublicSettings(),
          staleTime: 5 * 60 * 1000,
        })
      } catch {
        // El cliente reintenta; no bloquear SSR si la API no responde.
      }

      try {
        await useStoreAuthSession()
      } catch {
        // Mantener cookies; el cliente reintenta hidratar la sesión.
      }

      const authStore = useAuthStore()
      if (!authStore.isAuthenticated) return

      await Promise.allSettled([
        queryClient.fetchQuery({
          queryKey: storeQueryKeys.cartCount(),
          queryFn: () => fetchStoreCartCount(),
          staleTime: 30_000,
        }),
        queryClient.fetchQuery({
          queryKey: storeQueryKeys.favoritesCount(),
          queryFn: () => fetchStoreFavoritesCount(),
          staleTime: 30_000,
        }),
      ])
    }),
  )
}
