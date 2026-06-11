import { useQuery } from '@tanstack/vue-query'
import {
  fetchStoreFavoriteIds,
  fetchStoreFavorites,
  fetchStoreFavoritesCount,
} from '~/api/store-favorites.api'
import { storeQueryKeys } from '~/constants/query-keys'
import type { PaginatedResponse } from '~/types/pagination'
import type { StoreFavoriteItem } from '~/types/store-favorites'

export function useStoreFavoritesQuery(
  params: MaybeRefOrGetter<{ page?: number; limit?: number }> = {},
) {
  const authStore = useAuthStore()

  const queryParams = computed(() => {
    const raw = toValue(params)
    return {
      page: raw.page ?? 1,
      limit: raw.limit ?? 12,
    }
  })

  return useQuery<PaginatedResponse<StoreFavoriteItem>>({
    queryKey: computed(() => [...storeQueryKeys.favorites(), queryParams.value]),
    queryFn: () => fetchStoreFavorites(queryParams.value),
    enabled: computed(() => authStore.isAuthenticated),
    staleTime: 30 * 1000,
  })
}

export function useStoreFavoriteIdsQuery() {
  const authStore = useAuthStore()

  return useQuery<string[]>({
    queryKey: storeQueryKeys.favoriteIds(),
    queryFn: () => fetchStoreFavoriteIds(),
    enabled: computed(() => authStore.isAuthenticated),
    staleTime: 30 * 1000,
  })
}

export function useStoreFavoritesCountQuery() {
  const authStore = useAuthStore()

  return useQuery<number>({
    queryKey: storeQueryKeys.favoritesCount(),
    queryFn: () => fetchStoreFavoritesCount(),
    enabled: computed(() => authStore.isAuthenticated),
    staleTime: 30 * 1000,
  })
}
