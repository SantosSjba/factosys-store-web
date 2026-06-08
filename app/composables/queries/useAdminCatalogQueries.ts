import { useQuery } from '@tanstack/vue-query'
import {
  fetchAdminAttributes,
  fetchAdminBrands,
  fetchAdminCategory,
  fetchAdminCategoryTree,
  fetchAllAdminAttributes,
  fetchAdminProduct,
} from '~/api/admin-catalog.api'
import { enrichCategoryAttributes } from '~/utils/catalog/product-form'
import { flattenCategoryTree } from '~/utils/flatten-category-tree'
import { adminQueryKeys } from '~/constants/query-keys'
import type { PaginationParams } from '~/types/pagination'

export function useAdminCategoryTreeQuery() {
  const adminAuth = useAdminAuthStore()
  const { can } = useAdminPermissions()

  return useQuery({
    queryKey: adminQueryKeys.catalogCategories(),
    queryFn: fetchAdminCategoryTree,
    enabled: computed(() => {
      if (!adminAuth.accessToken) return false
      if (!adminAuth.profile) return true
      return can('products.read')
    }),
  })
}

export function useAdminBrandsQuery(
  params: MaybeRefOrGetter<PaginationParams> = {},
) {
  const adminAuth = useAdminAuthStore()
  const { can } = useAdminPermissions()

  const queryParams = computed(() => {
    const raw = toValue(params)
    return {
      page: raw.page ?? 1,
      limit: raw.limit ?? 10,
      search: raw.search?.trim() || undefined,
    }
  })

  return useQuery({
    queryKey: computed(() => [...adminQueryKeys.catalogBrands(), queryParams.value]),
    queryFn: () => fetchAdminBrands(queryParams.value),
    enabled: computed(() => {
      if (!adminAuth.accessToken) return false
      if (!adminAuth.profile) return true
      return can('products.read')
    }),
  })
}

export function useAdminAttributesQuery(
  params: MaybeRefOrGetter<PaginationParams> = {},
) {
  const adminAuth = useAdminAuthStore()
  const { can } = useAdminPermissions()

  const queryParams = computed(() => {
    const raw = toValue(params)
    return {
      page: raw.page ?? 1,
      limit: raw.limit ?? 10,
      search: raw.search?.trim() || undefined,
    }
  })

  return useQuery({
    queryKey: computed(() => [...adminQueryKeys.catalogAttributes(), queryParams.value]),
    queryFn: () => fetchAdminAttributes(queryParams.value),
    enabled: computed(() => {
      if (!adminAuth.accessToken) return false
      if (!adminAuth.profile) return true
      return can('products.read')
    }),
  })
}

export function useAdminCategoryDetailQuery(
  categoryId: MaybeRefOrGetter<string | null | undefined>,
) {
  const adminAuth = useAdminAuthStore()
  const { can } = useAdminPermissions()
  const id = computed(() => toValue(categoryId) || null)

  return useQuery({
    queryKey: computed(() =>
      id.value ? adminQueryKeys.catalogCategory(id.value) : ['admin', 'catalog-categories', 'none'],
    ),
    queryFn: () => fetchAdminCategory(id.value!),
    enabled: computed(() => {
      if (!id.value || !adminAuth.accessToken) return false
      if (!adminAuth.profile) return true
      return can('products.read')
    }),
  })
}

export function useAdminAllAttributesQuery() {
  const adminAuth = useAdminAuthStore()
  const { can } = useAdminPermissions()

  return useQuery({
    queryKey: [...adminQueryKeys.catalogAttributes(), 'all'],
    queryFn: fetchAllAdminAttributes,
    enabled: computed(() => {
      if (!adminAuth.accessToken) return false
      if (!adminAuth.profile) return true
      return can('products.read')
    }),
  })
}

export function useAdminCategoryProductAttributes(
  primaryCategoryId: MaybeRefOrGetter<string | undefined>,
) {
  const categoryId = computed(() => {
    const id = toValue(primaryCategoryId)?.trim()
    return id || null
  })
  const categoryQuery = useAdminCategoryDetailQuery(categoryId)
  const attributesQuery = useAdminAllAttributesQuery()

  const productAttributes = computed(() =>
    enrichCategoryAttributes(
      categoryQuery.data.value?.attributes ?? [],
      attributesQuery.data.value?.items ?? [],
    ).filter((attribute) => attribute.scope === 'PRODUCT'),
  )

  const variantAttributes = computed(() =>
    enrichCategoryAttributes(
      categoryQuery.data.value?.attributes ?? [],
      attributesQuery.data.value?.items ?? [],
    ).filter((attribute) => attribute.scope === 'VARIANT'),
  )

  // isPending queda true en queries deshabilitadas; isLoading solo durante fetch activo.
  const isLoading = computed(() => {
    if (!categoryId.value) return false

    return categoryQuery.isLoading.value || attributesQuery.isLoading.value
  })

  return {
    categoryQuery,
    attributesQuery,
    productAttributes,
    variantAttributes,
    isLoading,
  }
}

export function useAdminCatalogLookupsQuery() {
  const categoriesQuery = useAdminCategoryTreeQuery()
  const brandsQuery = useQuery({
    queryKey: [...adminQueryKeys.catalogBrands(), 'lookup'],
    queryFn: () => fetchAdminBrands({ page: 1, limit: 100 }),
    enabled: categoriesQuery.isEnabled,
  })

  const flatCategories = computed(() =>
    flattenCategoryTree(categoriesQuery.data.value ?? []),
  )

  const categoryOptions = computed(() =>
    flatCategories.value.map((item) => ({
      label: `${'— '.repeat(item.depth)}${item.name}`,
      value: item.id,
    })),
  )

  const brandOptions = computed(() => [
    { label: 'Sin marca', value: '' },
    ...(brandsQuery.data.value?.items ?? [])
      .filter((brand) => brand.isActive)
      .map((brand) => ({ label: brand.name, value: brand.id })),
  ])

  return { categoriesQuery, brandsQuery, flatCategories, categoryOptions, brandOptions }
}

export function useAdminProductQuery(productId: MaybeRefOrGetter<string | null>) {
  const adminAuth = useAdminAuthStore()
  const { can } = useAdminPermissions()
  const id = computed(() => toValue(productId))

  return useQuery({
    queryKey: computed(() =>
      id.value ? adminQueryKeys.product(id.value) : ['admin', 'products', 'none'],
    ),
    queryFn: () => fetchAdminProduct(id.value!),
    enabled: computed(() => {
      if (!id.value || !adminAuth.accessToken) return false
      if (!adminAuth.profile) return true
      return can('products.read')
    }),
  })
}
