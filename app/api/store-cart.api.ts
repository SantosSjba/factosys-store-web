import type {
  StoreCart,
  UpdateCartItemPayload,
  UpsertCartItemPayload,
} from '~/types/store-cart'

export async function fetchStoreCart() {
  const { data } = await useApi().get<StoreCart>('/store/cart')
  return data
}

export async function fetchStoreCartCount() {
  const { data } = await useApi().get<number>('/store/cart/count')
  return data
}

export async function addStoreCartItem(payload: UpsertCartItemPayload) {
  const { data } = await useApi().post<StoreCart>('/store/cart/items', payload)
  return data
}

export async function updateStoreCartItem(
  variantId: string,
  payload: UpdateCartItemPayload,
) {
  const { data } = await useApi().patch<StoreCart>(
    `/store/cart/items/${variantId}`,
    payload,
  )
  return data
}

export async function removeStoreCartItem(variantId: string) {
  const { data } = await useApi().delete<StoreCart>(
    `/store/cart/items/${variantId}`,
  )
  return data
}

export async function clearStoreCart() {
  const { data } = await useApi().delete<StoreCart>('/store/cart')
  return data
}
