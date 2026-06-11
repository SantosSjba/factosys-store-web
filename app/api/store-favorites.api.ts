import type { PaginatedResponse, PaginationParams } from '~/types/pagination'
import type { StoreFavoriteItem } from '~/types/store-favorites'

export async function fetchStoreFavorites(params: PaginationParams = {}) {
  const { data } = await useApi().get<PaginatedResponse<StoreFavoriteItem>>(
    '/store/favorites',
    { params },
  )
  return data
}

export async function fetchStoreFavoriteIds() {
  const { data } = await useApi().get<string[]>('/store/favorites/ids')
  return data
}

export async function fetchStoreFavoritesCount() {
  const { data } = await useApi().get<number>('/store/favorites/count')
  return data
}

export async function addStoreFavorite(productId: string) {
  const { data } = await useApi().post<{ id: string; productId: string; createdAt: string }>(
    '/store/favorites',
    { productId },
  )
  return data
}

export async function removeStoreFavorite(productId: string) {
  const { data } = await useApi().delete<{ success: boolean }>(
    `/store/favorites/${productId}`,
  )
  return data
}
