import type { StoreProduct } from '~/types/store'

export function getDefaultVariant(product: StoreProduct) {
  return (
    product.variants.find((variant) => variant.isDefault && variant.isActive) ??
    product.variants.find((variant) => variant.isActive) ??
    product.variants[0] ??
    null
  )
}

export function getProductDisplayPrice(product: StoreProduct) {
  const variant = getDefaultVariant(product)
  const price = variant ? Number.parseFloat(variant.price) : Number.NaN
  const compareAt = variant?.compareAtPrice
    ? Number.parseFloat(variant.compareAtPrice)
    : undefined

  return {
    price: Number.isFinite(price) ? price : 0,
    compareAt:
      compareAt !== undefined && Number.isFinite(compareAt) ? compareAt : undefined,
  }
}

export function isProductOnSale(product: StoreProduct) {
  const { price, compareAt } = getProductDisplayPrice(product)
  return compareAt !== undefined && compareAt > price
}

export function getDiscountPercent(price: number, compareAt: number) {
  if (compareAt <= price) return 0
  return Math.round(((compareAt - price) / compareAt) * 100)
}
