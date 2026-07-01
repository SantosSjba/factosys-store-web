import { useQueryClient } from '@tanstack/vue-query'
import { fetchStoreCartCount } from '~/api/store-cart.api'
import { fetchStoreFavoritesCount } from '~/api/store-favorites.api'
import { fetchStorePublicSettings } from '~/api/store-settings.api'
import { storeQueryKeys } from '~/constants/query-keys'

const SHELL_PREFETCH_ONCE_KEY = 'store-shell-prefetch'

export function useStoreShellPrefetch() {
  const nuxtApp = useNuxtApp()
  const queryClient = useQueryClient()

  return callOnce(SHELL_PREFETCH_ONCE_KEY, async () => {
    const withNuxtContext = <T>(fn: () => Promise<T>) =>
      nuxtApp.runWithContext(fn)

    try {
      await queryClient.fetchQuery({
        queryKey: storeQueryKeys.settings(),
        queryFn: () => withNuxtContext(fetchStorePublicSettings),
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
        queryFn: () => withNuxtContext(fetchStoreCartCount),
        staleTime: 30_000,
      }),
      queryClient.fetchQuery({
        queryKey: storeQueryKeys.favoritesCount(),
        queryFn: () => withNuxtContext(fetchStoreFavoritesCount),
        staleTime: 30_000,
      }),
    ])
  })
}
