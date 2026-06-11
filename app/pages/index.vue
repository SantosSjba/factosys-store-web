<script setup lang="ts">
import { isProductOnSale } from '~/utils/store/product'

const { data: settings } = useStoreSettingsQuery()
const {
  data: banners,
  isPending: bannersLoading,
  isError: bannersError,
  refetch: refetchBanners,
} = useStoreBannersQuery('HOME_HERO')
const {
  data: secondaryBanners,
  isPending: secondaryLoading,
} = useStoreBannersQuery('HOME_SECONDARY')
const { data: categories, isPending: categoriesLoading } = useStoreCategoriesQuery()
const { data: brands, isPending: brandsLoading } = useStoreBrandsQuery()
const {
  data: productsPage,
  isPending: productsLoading,
  isError: productsError,
  refetch: refetchProducts,
} = useStoreProductsQuery({
  page: 1,
  limit: 8,
})
const { data: catalogPage, isPending: catalogLoading } = useStoreProductsQuery({
  page: 1,
  limit: 24,
})

const storeName = computed(
  () => settings.value?.storeName ?? 'Factosys Store',
)

const offerProducts = computed(() =>
  (catalogPage.value?.items ?? []).filter(isProductOnSale).slice(0, 12),
)

const showOffersSection = computed(
  () => catalogLoading.value || offerProducts.value.length > 0,
)

const showcaseCategories = computed(() => (categories.value ?? []).slice(0, 3))

useStoreSeo(
  computed(() => ({
    title: storeName.value,
    description:
      settings.value?.storeTagline?.trim() ||
      `Tecnología con envío a todo el Perú. Compra online en ${storeName.value}.`,
  })),
)
</script>

<template>
  <div class="pb-16 md:pb-0">
    <StoreHeroCarousel
      :banners="banners ?? []"
      :loading="bannersLoading"
      :store-name="storeName"
      :store-tagline="settings?.storeTagline"
    />

    <StorePeruValueBar />

    <UiErrorState
      v-if="bannersError"
      title="No pudimos cargar los banners"
      class="mx-auto max-w-7xl px-4 py-6"
      @retry="refetchBanners()"
    />

    <StoreHomeSection
      v-if="showOffersSection"
      section-id="ofertas"
      title="Ofertas imperdibles"
      description="Los precios más bajos · Aprovecha hoy"
      action-label="Ver todo el catálogo"
      action-to="/productos"
      flash
    >
      <StoreProductRow
        :products="offerProducts"
        :loading="catalogLoading"
        :skeleton-count="6"
      >
        <template #empty>
          Pronto tendremos ofertas para ti.
        </template>
      </StoreProductRow>
    </StoreHomeSection>

    <StoreTrustBar />

    <StoreCategoryGrid
      :categories="categories ?? []"
      :loading="categoriesLoading"
    />

    <StoreSecondaryBanners
      :banners="secondaryBanners ?? []"
      :loading="secondaryLoading"
    />

    <StoreHomeSection
      title="Lo más pedido"
      :description="`Tecnología seleccionada en ${storeName}`"
      action-label="Ver todos"
      action-to="/productos"
    >
      <UiErrorState
        v-if="productsError"
        title="No pudimos cargar los productos"
        @retry="refetchProducts()"
      />

      <StoreProductGrid
        v-else
        :products="productsPage?.items ?? []"
        :loading="productsLoading"
        :skeleton-count="8"
        empty-message="Pronto tendremos productos destacados para ti"
      >
        <template #empty-action>
          <NuxtLink to="/productos">
            <UiButton icon="lucide:layout-grid">Explorar catálogo</UiButton>
          </NuxtLink>
        </template>
      </StoreProductGrid>
    </StoreHomeSection>

    <StoreBrandStrip
      :brands="brands ?? []"
      :loading="brandsLoading"
    />

    <StoreCategoryShowcase
      v-for="category in showcaseCategories"
      :key="category.id"
      :category-id="category.id"
      :category-name="category.name"
      :category-slug="category.slug"
    />

    <StorePromoCta />

    <StorePaymentTrust />

    <StoreSupportCta />
  </div>
</template>
