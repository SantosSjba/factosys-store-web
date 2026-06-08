import type {
  AssignCategoryAttributesPayload,
  CatalogAttribute,
  CatalogBrand,
  CatalogCategory,
  CatalogCategoryDetail,
  CatalogCategoryNode,
  CatalogProduct,
  CatalogProductImage,
  CreateAttributePayload,
  CreateBrandPayload,
  CreateCategoryPayload,
  CreateProductPayload,
  ListProductsParams,
  UpdateAttributePayload,
  UpdateBrandPayload,
  UpdateCategoryPayload,
  UpdateProductPayload,
} from '~/types/admin-catalog'
import type { PaginatedResponse, PaginationParams } from '~/types/pagination'

// ——— Productos ———

export async function fetchAdminProducts(params: ListProductsParams = {}) {
  const { data } = await useAdminApi().get<PaginatedResponse<CatalogProduct>>(
    '/admin/catalog/products',
    { params },
  )
  return data
}

export async function fetchAdminProduct(id: string) {
  const { data } = await useAdminApi().get<CatalogProduct>(
    `/admin/catalog/products/${id}`,
  )
  return data
}

export async function createAdminProduct(payload: CreateProductPayload) {
  const { data } = await useAdminApi().post<CatalogProduct>(
    '/admin/catalog/products',
    payload,
  )
  return data
}

export async function updateAdminProduct(id: string, payload: UpdateProductPayload) {
  const { data } = await useAdminApi().patch<CatalogProduct>(
    `/admin/catalog/products/${id}`,
    payload,
  )
  return data
}

export async function deleteAdminProduct(id: string) {
  const { data } = await useAdminApi().delete<{ message: string }>(
    `/admin/catalog/products/${id}`,
  )
  return data
}

export async function uploadAdminProductImage(
  productId: string,
  file: File,
  options?: { variantId?: string; alt?: string; isPrimary?: boolean },
) {
  const formData = new FormData()
  formData.append('file', file)
  if (options?.variantId) formData.append('variantId', options.variantId)
  if (options?.alt) formData.append('alt', options.alt)
  if (options?.isPrimary != null) {
    formData.append('isPrimary', String(options.isPrimary))
  }

  const { data } = await useAdminApi().post<CatalogProductImage>(
    `/admin/catalog/products/${productId}/images`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  )
  return data
}

export async function deleteAdminProductImage(productId: string, imageId: string) {
  const { data } = await useAdminApi().delete<{ message: string }>(
    `/admin/catalog/products/${productId}/images/${imageId}`,
  )
  return data
}

export async function setAdminProductImagePrimary(
  productId: string,
  imageId: string,
  isPrimary: boolean,
) {
  const { data } = await useAdminApi().patch<CatalogProductImage>(
    `/admin/catalog/products/${productId}/images/${imageId}/primary`,
    { isPrimary },
  )
  return data
}

export async function reorderAdminProductImages(
  productId: string,
  imageIds: string[],
) {
  const { data } = await useAdminApi().patch<CatalogProductImage[]>(
    `/admin/catalog/products/${productId}/images/order`,
    { imageIds },
  )
  return data
}

// ——— Categorías ———

export async function fetchAdminCategoryTree() {
  const { data } = await useAdminApi().get<CatalogCategoryNode[]>(
    '/admin/catalog/categories/tree',
  )
  return data
}

export async function fetchAdminCategoriesFlat() {
  const { data } = await useAdminApi().get<CatalogCategory[]>(
    '/admin/catalog/categories',
  )
  return data
}

export async function fetchAdminCategory(id: string) {
  const { data } = await useAdminApi().get<CatalogCategoryDetail>(
    `/admin/catalog/categories/${id}`,
  )
  return data
}

export async function createAdminCategory(payload: CreateCategoryPayload) {
  const { data } = await useAdminApi().post<CatalogCategory>(
    '/admin/catalog/categories',
    payload,
  )
  return data
}

export async function updateAdminCategory(id: string, payload: UpdateCategoryPayload) {
  const { data } = await useAdminApi().patch<CatalogCategory>(
    `/admin/catalog/categories/${id}`,
    payload,
  )
  return data
}

export async function deleteAdminCategory(id: string) {
  const { data } = await useAdminApi().delete<{ message: string }>(
    `/admin/catalog/categories/${id}`,
  )
  return data
}

export async function assignAdminCategoryAttributes(
  categoryId: string,
  payload: AssignCategoryAttributesPayload,
) {
  const { data } = await useAdminApi().put<CatalogCategoryDetail>(
    `/admin/catalog/categories/${categoryId}/attributes`,
    payload,
  )
  return data
}

// ——— Marcas ———

export async function fetchAdminBrands(params: PaginationParams = {}) {
  const { data } = await useAdminApi().get<PaginatedResponse<CatalogBrand>>(
    '/admin/catalog/brands',
    { params: { page: 1, limit: 10, ...params } },
  )
  return data
}

export async function fetchAdminBrand(id: string) {
  const { data } = await useAdminApi().get<CatalogBrand>(
    `/admin/catalog/brands/${id}`,
  )
  return data
}

export async function createAdminBrand(payload: CreateBrandPayload) {
  const { data } = await useAdminApi().post<CatalogBrand>(
    '/admin/catalog/brands',
    payload,
  )
  return data
}

export async function updateAdminBrand(id: string, payload: UpdateBrandPayload) {
  const { data } = await useAdminApi().patch<CatalogBrand>(
    `/admin/catalog/brands/${id}`,
    payload,
  )
  return data
}

export async function deleteAdminBrand(id: string) {
  const { data } = await useAdminApi().delete<{ message: string }>(
    `/admin/catalog/brands/${id}`,
  )
  return data
}

// ——— Atributos ———

export async function fetchAdminAttributes(params: PaginationParams = {}) {
  const { data } = await useAdminApi().get<PaginatedResponse<CatalogAttribute>>(
    '/admin/catalog/attributes',
    { params: { page: 1, limit: 10, ...params } },
  )
  return data
}

export async function fetchAllAdminAttributes() {
  const limit = 100
  const firstPage = await fetchAdminAttributes({ page: 1, limit })
  const items = [...firstPage.items]

  for (let page = 2; page <= firstPage.meta.totalPages; page += 1) {
    const nextPage = await fetchAdminAttributes({ page, limit })
    items.push(...nextPage.items)
  }

  return {
    items,
    meta: {
      ...firstPage.meta,
      page: 1,
      limit: items.length,
      total: items.length,
      totalPages: 1,
    },
  }
}

export async function fetchAdminAttribute(id: string) {
  const { data } = await useAdminApi().get<CatalogAttribute>(
    `/admin/catalog/attributes/${id}`,
  )
  return data
}

export async function createAdminAttribute(payload: CreateAttributePayload) {
  const { data } = await useAdminApi().post<CatalogAttribute>(
    '/admin/catalog/attributes',
    payload,
  )
  return data
}

export async function updateAdminAttribute(id: string, payload: UpdateAttributePayload) {
  const { data } = await useAdminApi().patch<CatalogAttribute>(
    `/admin/catalog/attributes/${id}`,
    payload,
  )
  return data
}

export async function deleteAdminAttribute(id: string) {
  const { data } = await useAdminApi().delete<{ message: string }>(
    `/admin/catalog/attributes/${id}`,
  )
  return data
}
