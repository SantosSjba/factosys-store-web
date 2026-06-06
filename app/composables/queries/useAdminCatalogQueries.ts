import { useQuery } from '@tanstack/vue-query'
import {
  fetchAdminAttributes,
  fetchAdminBrands,
  fetchAdminCategoryTree,
  fetchAdminProduct,
} from '~/api/admin-catalog.api'
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
