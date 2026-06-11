<script setup lang="ts">
import {
  findCategorySlug,
  getActiveVariants,
  getDefaultVariant,
  getDiscountPercent,
  getProductDisplayPrice,
  getProductImages,
  getVariantDisplayPrice,
} from '~/utils/store/product'

const route = useRoute()
const slug = computed(() => String(route.params.slug))

const { data: product, isPending, isError, refetch } = useStoreProductQuery(slug)
const { data: settings } = useStoreSettingsQuery()
const { data: categories } = useStoreCategoriesQuery()

const selectedVariantId = ref<string | null>(null)

const activeVariants = computed(() =>
  product.value ? getActiveVariants(product.value) : [],
)

const selectedVariant = computed(() => {
  if (!product.value) return null

  if (selectedVariantId.value) {
    return (
      activeVariants.value.find(
        (variant) => variant.id === selectedVariantId.value,
      ) ?? getDefaultVariant(product.value)
    )
  }

  return getDefaultVariant(product.value)
})

watch(
  product,
  (value) => {
    if (!value) {
      selectedVariantId.value = null
      return
    }
    selectedVariantId.value = getDefaultVariant(value)?.id ?? null
  },
  { immediate: true },
)

const displayImages = computed(() =>
  product.value
    ? getProductImages(product.value, selectedVariant.value?.id)
    : [],
)

const displayPrice = computed(() => {
  if (selectedVariant.value) {
    return getVariantDisplayPrice(selectedVariant.value)
  }
  return product.value ? getProductDisplayPrice(product.value) : null
})

const discountPercent = computed(() => {
  if (!displayPrice.value?.compareAt) return 0
  return getDiscountPercent(displayPrice.value.price, displayPrice.value.compareAt)
})

const currencyCode = computed(() => settings.value?.currency.code ?? 'PEN')

const categoryCatalogUrl = computed(() => {
  if (!product.value || !categories.value) return '/productos'
  const categorySlug = findCategorySlug(
    categories.value,
    product.value.primaryCategoryId,
  )
  return categorySlug
    ? `/productos?categoria=${categorySlug}`
    : '/productos'
})

const breadcrumbs = computed(() => {
  if (!product.value) {
    return [
      { label: 'Inicio', to: '/' },
      { label: 'Catálogo', to: '/productos' },
      { label: 'Producto' },
    ]
  }
  return [
    { label: 'Inicio', to: '/' },
    { label: 'Catálogo', to: '/productos' },
    {
      label: product.value.primaryCategoryName,
      to: categoryCatalogUrl.value,
    },
    { label: product.value.name },
  ]
})

const { data: relatedProductsPage } = useStoreProductsQuery(
  computed(() => ({
    page: 1,
    limit: 8,
    categoryId: product.value?.primaryCategoryId,
  })),
)

const relatedProducts = computed(() => {
  if (!product.value || !relatedProductsPage.value) return []
  return relatedProductsPage.value.items.filter(
    (item) => item.id !== product.value?.id,
  )
})

useStoreSeo(
  computed(() => ({
    title: product.value?.metaTitle || product.value?.name,
    description:
      product.value?.metaDescription ||
      product.value?.shortDescription ||
      undefined,
    image: displayImages.value[0]?.url || product.value?.primaryImageUrl,
  })),
)

const productJsonLd = computed(() => {
  if (!product.value || !displayPrice.value) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.value.name,
    description: product.value.shortDescription || product.value.description,
    image: displayImages.value.map((image) => image.url),
    sku: selectedVariant.value?.sku,
    brand: product.value.brandName
      ? { '@type': 'Brand', name: product.value.brandName }
      : undefined,
    offers: {
      '@type': 'Offer',
      priceCurrency: currencyCode.value,
      price: displayPrice.value.price,
      availability: 'https://schema.org/InStock',
      url: `${useRuntimeConfig().public.apiOrigin || ''}${route.path}`,
    },
  }
})

useHead({
  script: computed(() =>
    productJsonLd.value
      ? [
          {
            type: 'application/ld+json',
            innerHTML: JSON.stringify(productJsonLd.value),
          },
        ]
      : [],
  ),
})
</script>

<template>
  <section class="mx-auto max-w-7xl px-4 py-6 sm:py-8">
    <div
      v-if="isPending"
      class="grid gap-8 lg:grid-cols-2"
    >
      <UiSkeleton tone="store" height="100%" rounded="lg" class="aspect-square w-full" />
      <div class="space-y-4">
        <UiSkeleton tone="store" height="1rem" width="30%" />
        <UiSkeleton tone="store" height="2rem" width="80%" />
        <UiSkeleton tone="store" height="1.5rem" width="40%" />
        <UiSkeleton tone="store" height="5rem" width="100%" />
        <UiSkeleton tone="store" height="2.75rem" width="12rem" />
      </div>
    </div>

    <UiEmptyState
      v-else-if="isError || !product"
      icon="lucide:package-x"
      title="Producto no encontrado"
      description="El producto que buscas no está disponible o fue retirado del catálogo."
    >
      <template #action>
        <div class="flex flex-wrap justify-center gap-3">
          <UiButton variant="secondary" icon="lucide:refresh-cw" @click="refetch()">
            Reintentar
          </UiButton>
          <NuxtLink to="/productos">
            <UiButton icon="lucide:layout-grid">Volver al catálogo</UiButton>
          </NuxtLink>
        </div>
      </template>
    </UiEmptyState>

    <article
      v-else
      class="space-y-8 sm:space-y-10"
    >
      <UiBreadcrumb :items="breadcrumbs" tone="store" />

      <div class="grid gap-6 lg:grid-cols-2 lg:items-start lg:gap-10">
        <StoreProductGallery
          :images="displayImages"
          :product-name="product.name"
          :primary-url="product.primaryImageUrl"
        />

        <div class="lg:sticky lg:top-24 lg:space-y-5 lg:self-start sm:space-y-6">
          <div>
            <div class="flex flex-wrap items-center gap-2">
              <p
                v-if="product.brandName"
                class="text-theme-muted text-xs font-medium uppercase tracking-wide sm:text-sm"
              >
                {{ product.brandName }}
              </p>
              <UiBadge
                v-if="discountPercent > 0"
                variant="danger"
                class="normal-case"
              >
                -{{ discountPercent }}%
              </UiBadge>
            </div>
            <h1 class="text-theme mt-1 text-2xl font-bold sm:text-3xl lg:text-4xl">
              {{ product.name }}
            </h1>
            <NuxtLink
              :to="categoryCatalogUrl"
              class="text-theme-muted hover:text-brand-accent-deep mt-2 inline-block text-sm transition"
            >
              {{ product.primaryCategoryName }}
            </NuxtLink>
          </div>

          <UiPrice
            v-if="displayPrice"
            :price="displayPrice.price"
            :compare-at="displayPrice.compareAt"
            :currency="currencyCode"
          />

          <p
            v-if="product.shortDescription"
            class="text-theme text-sm leading-relaxed sm:text-base"
          >
            {{ product.shortDescription }}
          </p>

          <StoreProductVariantPicker
            v-if="activeVariants.length > 1 && selectedVariantId"
            v-model="selectedVariantId"
            :variants="activeVariants"
          />

          <div
            v-if="selectedVariant?.sku"
            class="text-theme-muted text-sm"
          >
            SKU:
            <span class="text-theme font-medium">{{ selectedVariant.sku }}</span>
          </div>

          <UiAlert variant="info">
            El carrito estará disponible muy pronto. Mientras tanto, puedes explorar
            nuestro catálogo o contactarnos para realizar tu pedido.
          </UiAlert>

          <div class="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <UiButton
              disabled
              icon="lucide:shopping-cart"
              aria-describedby="cart-soon-hint"
              class="sm:min-w-[12rem]"
            >
              Agregar al carrito
            </UiButton>
            <StoreFavoriteButton
              :product-id="product.id"
              size="lg"
              variant="inline"
              show-label
            />
            <NuxtLink to="/productos" class="w-full sm:w-auto">
              <UiButton
                variant="secondary"
                icon="lucide:store"
                class="w-full sm:w-auto"
              >
                Seguir comprando
              </UiButton>
            </NuxtLink>
          </div>
          <p id="cart-soon-hint" class="text-theme-muted text-xs">
            Función de carrito en desarrollo.
          </p>

          <StoreProductPurchaseHighlights />

          <div
            v-if="settings?.returnsPolicyUrl || settings?.warrantyPolicyUrl"
            class="border-theme grid gap-3 border-t pt-5 text-sm sm:grid-cols-2"
          >
            <a
              v-if="settings.returnsPolicyUrl"
              :href="settings.returnsPolicyUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="text-brand-accent-deep hover:underline"
            >
              Política de devoluciones
            </a>
            <a
              v-if="settings.warrantyPolicyUrl"
              :href="settings.warrantyPolicyUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="text-brand-accent-deep hover:underline"
            >
              Garantía del producto
            </a>
          </div>
        </div>
      </div>

      <div
        v-if="product.description"
        class="border-theme border-t pt-8"
      >
        <h2 class="text-theme text-lg font-semibold sm:text-xl">
          Descripción del producto
        </h2>
        <div class="text-theme-muted mt-4 max-w-3xl text-sm leading-relaxed sm:text-base">
          <p class="whitespace-pre-line">{{ product.description }}</p>
        </div>
      </div>

      <StoreHomeSection
        v-if="relatedProducts.length > 0"
        title="También te puede interesar"
        description="Productos relacionados de la misma categoría"
        action-label="Ver catálogo"
        :action-to="categoryCatalogUrl"
        muted
      >
        <StoreProductRow :products="relatedProducts" />
      </StoreHomeSection>
    </article>
  </section>
</template>
