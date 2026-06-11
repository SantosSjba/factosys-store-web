<script setup lang="ts">
import { getDefaultVariant, getProductDisplayPrice } from '~/utils/store/product'

const route = useRoute()
const slug = computed(() => String(route.params.slug))

const { data: product, isPending, isError, refetch } = useStoreProductQuery(slug)
const { data: settings } = useStoreSettingsQuery()

const displayPrice = computed(() =>
  product.value ? getProductDisplayPrice(product.value) : null,
)

const defaultVariant = computed(() =>
  product.value ? getDefaultVariant(product.value) : null,
)

const currencyCode = computed(() => settings.value?.currency.code ?? 'PEN')

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
    { label: product.value.primaryCategoryName },
    { label: product.value.name },
  ]
})

useStoreSeo(
  computed(() => ({
    title: product.value?.metaTitle || product.value?.name,
    description:
      product.value?.metaDescription ||
      product.value?.shortDescription ||
      undefined,
    image: product.value?.primaryImageUrl,
  })),
)

const productJsonLd = computed(() => {
  if (!product.value || !displayPrice.value) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.value.name,
    description: product.value.shortDescription || product.value.description,
    image: product.value.primaryImageUrl,
    sku: defaultVariant.value?.sku,
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
          <UiButton variant="secondary" @click="refetch()">
            Reintentar
          </UiButton>
          <NuxtLink to="/productos">
            <UiButton>Volver al catálogo</UiButton>
          </NuxtLink>
        </div>
      </template>
    </UiEmptyState>

    <article
      v-else
      class="space-y-6"
    >
      <UiBreadcrumb :items="breadcrumbs" tone="store" />

      <div class="grid gap-6 lg:grid-cols-2 lg:gap-10">
        <StoreProductGallery
          :images="product.images"
          :product-name="product.name"
          :primary-url="product.primaryImageUrl"
        />

        <div class="space-y-5 sm:space-y-6">
          <div>
            <p
              v-if="product.brandName"
              class="text-theme-muted text-xs font-medium uppercase tracking-wide sm:text-sm"
            >
              {{ product.brandName }}
            </p>
            <h1 class="text-theme mt-1 text-2xl font-bold sm:text-3xl lg:text-4xl">
              {{ product.name }}
            </h1>
            <p class="text-theme-muted mt-2 text-sm">
              {{ product.primaryCategoryName }}
            </p>
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

          <div
            v-if="defaultVariant?.sku"
            class="text-theme-muted text-sm"
          >
            SKU:
            <span class="text-theme font-medium">{{ defaultVariant.sku }}</span>
          </div>

          <UiAlert variant="info">
            El carrito estará disponible muy pronto. Mientras tanto, puedes explorar
            nuestro catálogo o contactarnos para realizar tu pedido.
          </UiAlert>

          <div class="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <UiButton disabled aria-describedby="cart-soon-hint">
              Agregar al carrito
            </UiButton>
            <StoreFavoriteButton
              v-if="product"
              :product-id="product.id"
              size="lg"
              variant="inline"
            />
            <NuxtLink to="/productos" class="w-full sm:w-auto">
              <UiButton variant="secondary" class="w-full sm:w-auto">
                Seguir comprando
              </UiButton>
            </NuxtLink>
          </div>
          <p id="cart-soon-hint" class="text-theme-muted text-xs">
            Función de carrito en desarrollo.
          </p>

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

          <div
            v-if="product.description"
            class="border-theme border-t pt-6"
          >
            <h2 class="text-theme text-lg font-semibold">Descripción</h2>
            <div
              class="text-theme-muted prose prose-sm prose-slate mt-3 max-w-none dark:prose-invert sm:prose-base"
            >
              <p class="whitespace-pre-line">{{ product.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </article>
  </section>
</template>
