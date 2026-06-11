<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const {
  data: cart,
  isPending,
  isError,
  error,
  refetch,
} = useStoreCartQuery()

useQueryErrorToast(isError, error)

const updateMutation = useUpdateStoreCartItemMutation()
const clearMutation = useClearStoreCartMutation()

const updatingVariantId = computed(() =>
  updateMutation.isPending.value
    ? updateMutation.variables.value?.variantId ?? null
    : null,
)

async function onQuantityChange(variantId: string, quantity: number) {
  await updateMutation.mutateAsync({ variantId, quantity })
}

async function onRemove(variantId: string) {
  await updateMutation.mutateAsync({ variantId, quantity: 0 })
}

async function onClearCart() {
  await clearMutation.mutateAsync()
}

const items = computed(() => cart.value?.items ?? [])
const itemCount = computed(() => cart.value?.itemCount ?? 0)

useStoreSeo({
  title: 'Mi carrito',
  noindex: true,
})
</script>

<template>
  <section class="mx-auto max-w-7xl px-4 py-8 sm:py-12">
    <UiPageHeader
      title="Mi carrito"
      :description="
        itemCount > 0
          ? `${itemCount} unidad${itemCount === 1 ? '' : 'es'} en tu carrito`
          : 'Revisa los productos que elegiste antes de continuar con tu compra.'
      "
      :breadcrumb="[
        { label: 'Inicio', to: '/' },
        { label: 'Mi carrito' },
      ]"
    />

    <div
      v-if="isPending"
      class="grid gap-8 lg:grid-cols-[1fr_minmax(18rem,22rem)]"
    >
      <div class="space-y-4">
        <UiSkeleton
          v-for="index in 3"
          :key="index"
          tone="store"
          height="6rem"
          rounded="lg"
        />
      </div>
      <UiSkeleton tone="store" height="16rem" rounded="2xl" />
    </div>

    <UiErrorState
      v-else-if="isError"
      title="No pudimos cargar tu carrito"
      @retry="refetch()"
    />

    <UiEmptyState
      v-else-if="!cart || items.length === 0"
      icon="lucide:shopping-cart"
      title="Tu carrito está vacío"
      description="Explora el catálogo y agrega productos para verlos aquí."
    >
      <template #action>
        <NuxtLink to="/productos">
          <UiButton icon="lucide:layout-grid">Explorar catálogo</UiButton>
        </NuxtLink>
      </template>
    </UiEmptyState>

    <div
      v-else
      class="grid gap-8 lg:grid-cols-[1fr_minmax(18rem,22rem)] lg:items-start"
    >
      <div class="border-theme bg-theme-surface rounded-2xl border px-4 sm:px-5">
        <CartLineItem
          v-for="item in items"
          :key="item.id"
          :product-name="item.productName"
          :variant-name="item.variantName"
          :product-slug="item.productSlug"
          :price="item.unitPrice"
          :compare-at-price="item.compareAtPrice"
          :quantity="item.quantity"
          :max-quantity="item.maxQuantity"
          :image-url="item.imageUrl"
          :currency="cart.currencyCode"
          :loading="updatingVariantId === item.variantId"
          @update:quantity="onQuantityChange(item.variantId, $event)"
          @remove="onRemove(item.variantId)"
        />
      </div>

      <StoreCartSummary
        :cart="cart"
        :clearing="clearMutation.isPending.value"
        @clear="onClearCart"
      />
    </div>
  </section>
</template>
