<script setup lang="ts">
import type { StoreProduct } from '~/types/store'
import { getProductDisplayPrice, getStoreTaxBadgeLabel } from '~/utils/store/product'

const props = defineProps<{
  product: StoreProduct
}>()

const display = computed(() => getProductDisplayPrice(props.product))
const { data: settings } = useStoreSettingsQuery()
const taxBadgeLabel = computed(() => getStoreTaxBadgeLabel(settings.value))
</script>

<template>
  <article class="border-theme bg-theme-surface group relative overflow-hidden rounded-xl border shadow-sm transition hover:shadow-md">
    <StoreFavoriteButton
      :product-id="product.id"
      variant="overlay"
    />

    <NuxtLink
      :to="`/productos/${product.slug}`"
      class="relative z-0 block"
    >
      <div class="bg-theme-muted relative aspect-square overflow-hidden">
        <StoreImage
          v-if="product.primaryImageUrl"
          :src="product.primaryImageUrl"
          :alt="product.name"
          click-through
          img-class="motion-safe:transition h-full w-full motion-safe:group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        <div
          v-else
          class="text-theme-muted flex h-full items-center justify-center"
        >
          <UiIcon name="lucide:image" :size="40" />
        </div>
      </div>

      <div class="space-y-2 p-3 sm:p-4">
        <p
          v-if="product.brandName"
          class="text-theme-muted text-xs font-medium uppercase tracking-wide"
        >
          {{ product.brandName }}
        </p>
        <h3 class="text-theme line-clamp-2 text-sm font-medium leading-snug">
          {{ product.name }}
        </h3>
        <UiPrice
          :price="display.price"
          :compare-at="display.compareAt"
        />
        <UiBadge v-if="taxBadgeLabel" variant="default" class="normal-case">
          {{ taxBadgeLabel }}
        </UiBadge>
      </div>
    </NuxtLink>
  </article>
</template>
