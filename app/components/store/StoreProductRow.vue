<script setup lang="ts">
import StoreProductCard from '~/components/store/StoreProductCard.vue'
import type { StoreProduct } from '~/types/store'
import {
  getDiscountPercent,
  getProductDisplayPrice,
  isProductOnSale,
} from '~/utils/store/product'

defineProps<{
  products: StoreProduct[]
  loading?: boolean
  skeletonCount?: number
}>()

const {
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onClickCapture,
} = usePointerClickIntent()

function productBadge(product: StoreProduct) {
  if (!isProductOnSale(product)) return undefined
  const { price, compareAt } = getProductDisplayPrice(product)
  if (!compareAt) return 'Oferta'
  const pct = getDiscountPercent(price, compareAt)
  return pct > 0 ? `-${pct}%` : 'Oferta'
}
</script>

<template>
  <div
    v-if="loading"
    class="-mx-4 flex gap-3 overflow-hidden px-4"
  >
    <div
      v-for="index in skeletonCount ?? 6"
      :key="index"
      class="w-40 shrink-0 sm:w-48"
    >
      <UiSkeleton tone="store" height="10rem" rounded="lg" />
    </div>
  </div>

  <div
    v-else-if="products.length > 0"
    class="relative -mx-4 flex gap-3 overflow-x-auto px-4 pb-1 snap-x snap-mandatory scroll-smooth sm:gap-4"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
    @click.capture="onClickCapture"
  >
    <div
      v-for="product in products"
      :key="product.id"
      class="w-40 shrink-0 snap-start sm:w-48 md:w-52"
    >
      <StoreProductCard
        v-bind="{
          title: product.name,
          ...getProductDisplayPrice(product),
          imageUrl: product.primaryImageUrl || undefined,
          badge: productBadge(product),
          to: `/productos/${product.slug}`,
          productId: product.id,
        }"
      />
    </div>
  </div>

  <p
    v-else
    class="text-theme-muted text-center text-sm"
  >
    <slot name="empty">No hay productos para mostrar.</slot>
  </p>
</template>
