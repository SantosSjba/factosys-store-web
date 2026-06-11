<script setup lang="ts">
import type { BreadcrumbItem } from '~/types/ui'

const route = useRoute()
const router = useRouter()

const page = computed(() => Number(route.query.page) || 1)
const search = computed(() => String(route.query.q ?? '').trim())
const categorySlug = computed(() => String(route.query.categoria ?? '').trim())
const brandId = computed(() => String(route.query.marca ?? '').trim())

const { data: categories } = useStoreCategoriesQuery()
const { data: brands } = useStoreBrandsQuery()

const selectedCategoryId = computed(() => {
  if (!categorySlug.value || !categories.value) return undefined

  const findBySlug = (
    nodes: typeof categories.value,
    slug: string,
  ): string | undefined => {
    for (const node of nodes) {
      if (node.slug === slug) return node.id
      const childMatch = findBySlug(node.children, slug)
      if (childMatch) return childMatch
    }
    return undefined
  }

  return findBySlug(categories.value, categorySlug.value)
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
    search: search.value || undefined,
    categoryId: selectedCategoryId.value,
    brandId: brandId.value || undefined,
  })),
)

const { data: categoryBanner, isPending: categoryBannerLoading } =
  useStoreBannersQuery('CATEGORY_TOP')

const selectedCategoryName = computed(() => {
  if (!categorySlug.value || !categories.value) return null

  const findName = (
    nodes: typeof categories.value,
    slug: string,
  ): string | null => {
    for (const node of nodes) {
      if (node.slug === slug) return node.name
      const childName = findName(node.children, slug)
      if (childName) return childName
    }
    return null
  }

  return findName(categories.value, categorySlug.value)
})

const selectedBrandName = computed(() => {
  if (!brandId.value || !brands.value) return null
  return brands.value.find((brand) => brand.id === brandId.value)?.name ?? null
})

const pageTitle = computed(() => {
  if (search.value) return `Resultados para "${search.value}"`
  if (selectedCategoryName.value) return selectedCategoryName.value
  if (selectedBrandName.value) return selectedBrandName.value
  return 'Catálogo'
})

const hasActiveFilters = computed(
  () => Boolean(search.value || categorySlug.value || brandId.value),
)

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

useStoreSeo(
  computed(() => ({
    title: pageTitle.value,
    description: pageDescription.value,
  })),
)

function clearFilters() {
  router.push({ path: '/productos' })
}

function setBrandFilter(id: string) {
  const query = {
    ...route.query,
    marca: brandId.value === id ? undefined : id,
    page: undefined,
  }
  router.push({ path: '/productos', query })
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

    <div
      v-if="brands?.length || hasActiveFilters"
      class="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
    >
      <div
        v-if="brands?.length"
        class="scrollbar-thin flex gap-2 overflow-x-auto pb-1"
      >
        <button
          v-for="brand in brands"
          :key="brand.id"
          type="button"
          class="shrink-0 rounded-full border px-3 py-1.5 text-sm font-medium transition"
          :class="
            brandId === brand.id
              ? 'border-brand-accent bg-brand-accent-soft text-brand-accent'
              : 'border-theme bg-theme-surface text-theme hover:border-brand-accent'
          "
          @click="setBrandFilter(brand.id)"
        >
          {{ brand.name }}
        </button>
      </div>

      <button
        v-if="hasActiveFilters"
        type="button"
        class="text-brand-accent-deep text-sm font-semibold hover:underline"
        @click="clearFilters"
      >
        Limpiar filtros
      </button>
    </div>

    <UiErrorState
      v-if="isError"
      title="No pudimos cargar el catálogo"
      @retry="refetch()"
    />

    <template v-else>
      <StoreProductGrid
        :products="productsPage?.items ?? []"
        :loading="isPending"
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
