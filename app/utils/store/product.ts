import type { CatalogProductImage, CatalogProductVariant } from '~/types/admin-catalog'
import type { StoreCategoryNode, StoreProduct } from '~/types/store'

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

export function getActiveVariants(product: StoreProduct) {
  return product.variants
    .filter((variant) => variant.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder)
}

export function getVariantDisplayPrice(variant: CatalogProductVariant) {
  const price = Number.parseFloat(variant.price)
  const compareAt = variant.compareAtPrice
    ? Number.parseFloat(variant.compareAtPrice)
    : undefined

  return {
    price: Number.isFinite(price) ? price : 0,
    compareAt:
      compareAt !== undefined && Number.isFinite(compareAt) ? compareAt : undefined,
  }
}

export function getVariantLabel(variant: CatalogProductVariant) {
  if (variant.name?.trim()) return variant.name.trim()

  const attributes = variant.attributeValues
    .map((entry) => entry.value.trim())
    .filter(Boolean)

  if (attributes.length > 0) return attributes.join(' · ')

  return variant.sku
}

export function getProductImages(
  product: StoreProduct,
  variantId?: string | null,
): CatalogProductImage[] {
  const sorted = [...product.images].sort((a, b) => a.sortOrder - b.sortOrder)

  if (variantId) {
    const variantImages = sorted.filter((image) => image.variantId === variantId)
    if (variantImages.length > 0) return variantImages
  }

  const generalImages = sorted.filter((image) => !image.variantId)
  if (generalImages.length > 0) return generalImages
  if (sorted.length > 0) return sorted

  if (product.primaryImageUrl) {
    return [
      {
        id: 'primary',
        productId: product.id,
        variantId: null,
        url: product.primaryImageUrl,
        storageKey: '',
        alt: product.name,
        sortOrder: 0,
        isPrimary: true,
        mimeType: null,
        sizeBytes: null,
      },
    ]
  }

  return []
}

export function findCategorySlug(
  nodes: StoreCategoryNode[] | undefined,
  categoryId: string,
): string | undefined {
  if (!nodes) return undefined

  for (const node of nodes) {
    if (node.id === categoryId) return node.slug
    const childSlug = findCategorySlug(node.children, categoryId)
    if (childSlug) return childSlug
  }

  return undefined
}
