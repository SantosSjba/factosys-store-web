<script setup lang="ts">
import StoreProductCard from '~/components/store/StoreProductCard.vue'
import type { StoreProduct } from '~/types/store'
import { getProductDisplayPrice } from '~/utils/store/product'

const props = withDefaults(
  defineProps<{
    products: StoreProduct[]
    loading?: boolean
    emptyMessage?: string
    skeletonCount?: number
  }>(),
  { skeletonCount: 8 },
)
</script>

<template>
  <div>
    <div
      v-if="loading"
      class="grid gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4"
    >
      <StoreProductCardSkeleton
        v-for="index in props.skeletonCount"
        :key="index"
      />
    </div>

    <UiEmptyState
      v-else-if="products.length === 0"
      icon="lucide:package-search"
      :title="emptyMessage || 'No hay productos para mostrar'"
    >
      <template v-if="$slots['empty-action']" #action>
        <slot name="empty-action" />
      </template>
    </UiEmptyState>

    <div
      v-else
      class="grid gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4"
    >
      <StoreProductCard
        v-for="product in products"
        :key="product.id"
        v-bind="{
          title: product.name,
          ...getProductDisplayPrice(product),
          imageUrl: product.primaryImageUrl || undefined,
          to: `/productos/${product.slug}`,
          productId: product.id,
        }"
      />
    </div>
  </div>
</template>
