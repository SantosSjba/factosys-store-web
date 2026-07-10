import type { PaginatedResponse } from '~/types/pagination'
import type {
  ListStoreCatalogFiltersParams,
  ListStoreProductsParams,
  StoreCatalogFiltersResponse,
  StoreCategoryNode,
  StoreProduct,
} from '~/types/store'
import type { CatalogBrand } from '~/types/admin-catalog'

export async function fetchStoreProducts(
  params: ListStoreProductsParams = {},
): Promise<PaginatedResponse<StoreProduct>> {
  const { data } = await useApi().get<PaginatedResponse<StoreProduct>>(
    '/store/catalog/products',
    { params, withAuth: false },
  )
  return data
}

export async function fetchStoreProductBySlug(
  slug: string,
): Promise<StoreProduct> {
  const { data } = await useApi().get<StoreProduct>(
    `/store/catalog/products/${slug}`,
    { withAuth: false },
  )
  return data
}

export async function fetchStoreCategoryTree(): Promise<StoreCategoryNode[]> {
  const { data } = await useApi().get<StoreCategoryNode[]>(
    '/store/catalog/categories/tree',
    { withAuth: false },
  )
  return data
}

export async function fetchStoreBrands() {
  const { data } = await useApi().get<CatalogBrand[]>(
    '/store/catalog/brands',
    { withAuth: false },
  )
  return data
}

export async function fetchStoreCatalogFilters(
  params: ListStoreCatalogFiltersParams = {},
): Promise<StoreCatalogFiltersResponse> {
  const { data } = await useApi().get<StoreCatalogFiltersResponse>(
    '/store/catalog/filters',
    { params, withAuth: false },
  )
  return data
}
