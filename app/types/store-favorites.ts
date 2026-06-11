import type { StoreProduct } from '~/types/store'

export type StoreFavoriteItem = {
  id: string
  productId: string
  createdAt: string
  product: StoreProduct
}
