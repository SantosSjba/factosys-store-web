import type { CatalogCategoryNode, CatalogProduct } from '~/types/admin-catalog'

export type StorePublicSettings = {
  storeName: string
  storeTagline: string | null
  logoUrl: string | null
  faviconUrl: string | null
  defaultLocale: string
  timezone: string
  currency: {
    code: string
    symbol: string
    decimalPlaces: number
  }
  tax: {
    name: string
    rate: string
    pricesIncludeTax: boolean
  } | null
  maintenanceMode: boolean
  maintenanceMessage: string | null
  guestCheckoutEnabled: boolean
  minOrderAmount: string | null
  freeShippingMinAmount: string | null
  handlingDaysMin: number | null
  handlingDaysMax: number | null
  warrantyPolicyUrl: string | null
  returnsPolicyUrl: string | null
  privacyPolicyUrl: string | null
  termsUrl: string | null
  complaintsBookUrl: string | null
  company: {
    tradeName: string | null
    supportEmail: string | null
    supportPhone: string | null
    whatsapp: string | null
    website: string | null
  }
}

export type StoreBannerPlacement =
  | 'HOME_HERO'
  | 'HOME_SECONDARY'
  | 'CATEGORY_TOP'

export type StoreBanner = {
  id: string
  title: string
  subtitle: string | null
  imageUrl: string | null
  linkUrl: string | null
  placement: StoreBannerPlacement
  sortOrder: number
}

export type StoreCatalogFilterOption = {
  value: string
  label: string
  count?: number
}

export type StoreCatalogFilterGroup = {
  key: string
  label: string
  type: 'category' | 'brand' | 'attribute'
  options: StoreCatalogFilterOption[]
}

export type StoreCatalogFiltersResponse = {
  groups: StoreCatalogFilterGroup[]
}

export type ListStoreCatalogFiltersParams = {
  categoryId?: string
  brandId?: string
  search?: string
  attrs?: string
}

export type ListStoreProductsParams = {
  page?: number
  limit?: number
  search?: string
  categoryId?: string
  brandId?: string
  attrs?: string
}

export type StoreProduct = CatalogProduct
export type StoreCategoryNode = CatalogCategoryNode
