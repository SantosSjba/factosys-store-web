export type StoreCartLineItem = {
  id: string
  variantId: string
  productId: string
  productSlug: string
  productName: string
  variantName: string | null
  sku: string
  quantity: number
  unitPrice: number
  compareAtPrice: number | null
  lineSubtotal: number
  imageUrl: string | null
  maxQuantity: number
}

export type StoreCart = {
  id: string
  itemCount: number
  subtotal: number
  currencyCode: string
  items: StoreCartLineItem[]
  updatedAt: string
}

export type UpsertCartItemPayload = {
  variantId: string
  quantity?: number
}

export type UpdateCartItemPayload = {
  quantity: number
}
