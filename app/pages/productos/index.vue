<script setup lang="ts">
import type { BreadcrumbItem } from '~/types/ui'
import type { StoreCatalogFilterGroup } from '~/types/store'
import { findCategoryBySlug } from '~/utils/store/category-tree'
import {
  parseCatalogAttributeFilters,
  serializeCatalogAttributeFilters,
} from '~/utils/store/catalog-filters'

const route = useRoute()
const router = useRouter()

const page = computed(() => Number(route.query.page) || 1)
const search = computed(() => String(route.query.q ?? '').trim())
const categorySlug = computed(() => String(route.query.categoria ?? '').trim())
const brandId = computed(() => String(route.query.marca ?? '').trim())
const attributeFilters = computed(() =>
  parseCatalogAttributeFilters(route.query.attrs),
)
const serializedAttrs = computed(() =>
  serializeCatalogAttributeFilters(attributeFilters.value),
)

const { data: categories, isPending: categoriesLoading } = useStoreCategoriesQuery()

const selectedCategory = computed(() => {
  if (!categorySlug.value || !categories.value) return undefined
  return findCategoryBySlug(categories.value, categorySlug.value)
})

const selectedCategoryId = computed(() => selectedCategory.value?.id)

const productsQueryEnabled = computed(() => {
  if (!categorySlug.value) return true
  return Boolean(categories.value)
})

const unknownCategorySlug = computed(
  () =>
    Boolean(categorySlug.value) &&
    Boolean(categories.value) &&
    !selectedCategory.value,
)

const catalogQuery = computed(() => ({
  categoryId: selectedCategoryId.value,
  brandId: brandId.value || undefined,
  search: search.value || undefined,
  attrs: serializedAttrs.value,
}))

const {
  data: filtersData,
  isPending: filtersLoading,
} = useStoreCatalogFiltersQuery(catalogQuery, {
  enabled: productsQueryEnabled,
})

const {
  data: productsPage,
  isPending,
  isError,
  refetch,
} = useStoreProductsQuery(
  computed(() => ({
    page: page.value,
    limit: 12,
    ...catalogQuery.value,
  })),
  { enabled: productsQueryEnabled },
)

const { data: categoryBanner, isPending: categoryBannerLoading } =
  useStoreBannersQuery('CATEGORY_TOP')

const selectedCategoryName = computed(
  () => selectedCategory.value?.name ?? null,
)

const selectedBrandName = computed(() => {
  const brandGroup = filtersData.value?.groups.find((group) => group.type === 'brand')
  if (!brandId.value || !brandGroup) return null
  return brandGroup.options.find((option) => option.value === brandId.value)?.label ?? null
})

const pageTitle = computed(() => {
  if (search.value) return `Resultados para "${search.value}"`
  if (selectedCategoryName.value) return selectedCategoryName.value
  if (selectedBrandName.value) return selectedBrandName.value
  return 'Catálogo'
})

const breadcrumbs = computed<BreadcrumbItem[]>(() => {
  const items: BreadcrumbItem[] = [
    { label: 'Inicio', to: '/' },
    { label: 'Catálogo', to: '/productos' },
  ]
  if (selectedCategoryName.value) {
    items.push({ label: selectedCategoryName.value })
  } else if (search.value) {
    items.push({ label: `Búsqueda: ${search.value}` })
  } else if (selectedBrandName.value) {
    items.push({ label: selectedBrandName.value })
  }
  return items
})

const pageDescription = computed(() => {
  if (search.value) {
    return `Resultados de búsqueda para "${search.value}" en nuestro catálogo.`
  }
  if (selectedCategoryName.value) {
    return `Explora productos de ${selectedCategoryName.value}.`
  }
  return 'Explora nuestro catálogo de productos con envíos a todo el Perú.'
})

const activeChips = computed(() => {
  const chips: Array<{
    key: string
    label: string
    type: 'search' | 'category' | 'brand' | 'attribute'
    attributeSlug?: string
  }> = []

  if (search.value) {
    chips.push({ key: 'search', label: `"${search.value}"`, type: 'search' })
  }
  if (categorySlug.value && selectedCategoryName.value) {
    chips.push({
      key: 'category',
      label: selectedCategoryName.value,
      type: 'category',
    })
  }
  if (brandId.value && selectedBrandName.value) {
    chips.push({
      key: 'brand',
      label: selectedBrandName.value,
      type: 'brand',
    })
  }

  for (const group of filtersData.value?.groups ?? []) {
    if (group.type !== 'attribute') continue
    const value = attributeFilters.value[group.key]
    if (!value) continue
    const option = group.options.find((entry) => entry.value === value)
    chips.push({
      key: `attr-${group.key}`,
      label: option?.label ?? `${group.label}: ${value}`,
      type: 'attribute',
      attributeSlug: group.key,
    })
  }

  return chips
})

useStoreSeo(
  computed(() => ({
    title: pageTitle.value,
    description: pageDescription.value,
  })),
)

function pushCatalogQuery(
  query: Record<string, string | undefined>,
) {
  router.push({
    path: '/productos',
    query: {
      ...route.query,
      ...query,
      page: undefined,
    },
  })
}

function clearFilters() {
  router.push({ path: '/productos' })
}

function onFilterSelect(group: StoreCatalogFilterGroup, value: string) {
  if (group.type === 'category') {
    pushCatalogQuery({ categoria: categorySlug.value === value ? undefined : value })
    return
  }

  if (group.type === 'brand') {
    pushCatalogQuery({ marca: brandId.value === value ? undefined : value })
    return
  }

  const nextAttrs = { ...attributeFilters.value }
  if (nextAttrs[group.key] === value) {
    delete nextAttrs[group.key]
  } else {
    nextAttrs[group.key] = value
  }

  pushCatalogQuery({
    attrs: serializeCatalogAttributeFilters(nextAttrs),
  })
}

function removeFilter(chip: (typeof activeChips.value)[number]) {
  if (chip.type === 'search') {
    pushCatalogQuery({ q: undefined })
    return
  }
  if (chip.type === 'category') {
    pushCatalogQuery({ categoria: undefined })
    return
  }
  if (chip.type === 'brand') {
    pushCatalogQuery({ marca: undefined })
    return
  }
  if (chip.type === 'attribute' && chip.attributeSlug) {
    const nextAttrs = { ...attributeFilters.value }
    delete nextAttrs[chip.attributeSlug]
    pushCatalogQuery({
      attrs: serializeCatalogAttributeFilters(nextAttrs),
    })
  }
}

function onPageChange(nextPage: number) {
  router.push({ query: { ...route.query, page: nextPage > 1 ? nextPage : undefined } })
  if (import.meta.client) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
</script>

<template>
  <section class="mx-auto max-w-7xl px-4 py-6 sm:py-8">
    <UiPageHeader
      :title="pageTitle"
      :breadcrumb="breadcrumbs"
      :description="
        productsPage?.meta
          ? `${productsPage.meta.total} producto(s) encontrado(s)`
          : isPending
            ? 'Cargando productos…'
            : undefined
      "
    />

    <StoreSecondaryBanners
      v-if="categorySlug && (categoryBanner?.length || categoryBannerLoading)"
      :banners="categoryBanner ?? []"
      :loading="categoryBannerLoading"
    />

    <p
      v-if="unknownCategorySlug"
      class="border-theme bg-theme-muted text-theme-muted mb-6 rounded-lg border px-4 py-3 text-sm"
    >
      La categoría seleccionada no existe o ya no está disponible.
    </p>

    <StoreCatalogFilters
      :groups="filtersData?.groups ?? []"
      :loading="filtersLoading && productsQueryEnabled"
      :category-slug="categorySlug"
      :brand-id="brandId"
      :search="search"
      :attribute-filters="attributeFilters"
      :active-chips="activeChips"
      @select="onFilterSelect"
      @remove="removeFilter"
      @clear="clearFilters"
    />

    <UiErrorState
      v-if="isError"
      title="No pudimos cargar el catálogo"
      @retry="refetch()"
    />

    <template v-else>
      <StoreProductGrid
        :products="productsPage?.items ?? []"
        :loading="isPending || (categoriesLoading && Boolean(categorySlug))"
        :skeleton-count="12"
        empty-message="No encontramos productos con esos filtros"
      >
        <template #empty-action>
          <UiButton variant="secondary" icon="lucide:filter-x" @click="clearFilters">
            Limpiar filtros
          </UiButton>
        </template>
      </StoreProductGrid>

      <div
        v-if="productsPage && productsPage.meta.total > 0"
        class="mt-8"
      >
        <UiPagination
          :page="page"
          :page-size="productsPage.meta.limit"
          :total="productsPage.meta.total"
          tone="store"
          @update:page="onPageChange"
        />
      </div>
    </template>
  </section>
</template>
