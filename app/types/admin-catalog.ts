export type ProductStatus = 'DRAFT' | 'ACTIVE' | 'ARCHIVED'
export type ProductType = 'SIMPLE' | 'VARIABLE'
export type AttributeDataType =
  | 'TEXT'
  | 'NUMBER'
  | 'BOOLEAN'
  | 'SELECT'
  | 'MULTI_SELECT'
export type AttributeScope = 'PRODUCT' | 'VARIANT'

export type CatalogAttribute = {
  id: string
  slug: string
  name: string
  description: string | null
  dataType: AttributeDataType
  unit: string | null
  scope: AttributeScope
  options: string[]
  isFilterable: boolean
  isRequired: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export type CatalogCategoryDetail = CatalogCategory & {
  attributes: Array<{
    attributeId: string
    attributeName: string
    attributeSlug: string
    scope: AttributeScope
    dataType: AttributeDataType
    isRequired: boolean
    sortOrder: number
  }>
}

export type CatalogCategory = {
  id: string
  name: string
  slug: string
  description: string | null
  parentId: string | null
  imageUrl: string | null
  sortOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type CatalogCategoryNode = CatalogCategory & {
  children: CatalogCategoryNode[]
}

export type CatalogBrand = {
  id: string
  name: string
  slug: string
  description: string | null
  logoUrl: string | null
  website: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type CatalogProductVariant = {
  id: string
  productId: string
  sku: string
  barcode: string | null
  name: string | null
  price: string
  compareAtPrice: string | null
  cost: string | null
  weight: string | null
  isDefault: boolean
  isActive: boolean
  sortOrder: number
  attributeValues: Array<{
    attributeId: string
    attributeSlug: string
    attributeName: string
    value: string
  }>
}

export type CatalogProductImage = {
  id: string
  productId: string
  variantId: string | null
  url: string
  storageKey: string
  alt: string | null
  sortOrder: number
  isPrimary: boolean
  mimeType: string | null
  sizeBytes: number | null
}

export type CatalogProduct = {
  id: string
  name: string
  slug: string
  shortDescription: string | null
  description: string | null
  brandId: string | null
  brandName: string | null
  primaryCategoryId: string
  primaryCategoryName: string
  productType: ProductType
  status: ProductStatus
  metaTitle: string | null
  metaDescription: string | null
  tags: string[]
  publishedAt: string | null
  createdAt: string
  updatedAt: string
  categoryIds: string[]
  attributeValues: Array<{
    attributeId: string
    attributeSlug: string
    attributeName: string
    value: string
  }>
  variants: CatalogProductVariant[]
  images: CatalogProductImage[]
  defaultPrice: string | null
  primaryImageUrl: string | null
}

export type ProductAttributeValuePayload = {
  attributeId: string
  value: string
}

export type ProductVariantPayload = {
  id?: string
  sku: string
  name?: string
  barcode?: string
  price: number
  compareAtPrice?: number
  cost?: number
  weight?: number
  isDefault?: boolean
  isActive?: boolean
  sortOrder?: number
  attributeValues?: ProductAttributeValuePayload[]
}

export type CreateProductPayload = {
  name: string
  slug?: string
  shortDescription?: string
  description?: string
  brandId?: string
  primaryCategoryId: string
  productType?: ProductType
  status?: ProductStatus
  metaTitle?: string
  metaDescription?: string
  tags?: string[]
  categoryIds?: string[]
  attributeValues?: ProductAttributeValuePayload[]
  variants: ProductVariantPayload[]
}

export type ListProductsParams = {
  page?: number
  limit?: number
  search?: string
  categoryId?: string
  brandId?: string
  status?: ProductStatus
}

export type CreateCategoryPayload = {
  name: string
  slug?: string
  description?: string
  parentId?: string
  sortOrder?: number
  isActive?: boolean
}

export type UpdateCategoryPayload = Partial<CreateCategoryPayload>

export type CreateBrandPayload = {
  name: string
  slug?: string
  description?: string
  website?: string
  isActive?: boolean
}

export type UpdateBrandPayload = Partial<CreateBrandPayload>

export type CreateAttributePayload = {
  name: string
  slug?: string
  description?: string
  dataType?: AttributeDataType
  unit?: string
  scope?: AttributeScope
  options?: string[]
  isFilterable?: boolean
  isRequired?: boolean
  sortOrder?: number
}

export type UpdateAttributePayload = Partial<CreateAttributePayload>

export type UpdateProductPayload = {
  name?: string
  slug?: string
  shortDescription?: string
  description?: string
  brandId?: string | null
  primaryCategoryId?: string
  productType?: ProductType
  status?: ProductStatus
  metaTitle?: string
  metaDescription?: string
  tags?: string[]
  categoryIds?: string[]
  attributeValues?: ProductAttributeValuePayload[]
  variants?: ProductVariantPayload[]
}

export type AssignCategoryAttributesPayload = {
  attributes: Array<{
    attributeId: string
    isRequired?: boolean
    sortOrder?: number
  }>
}
