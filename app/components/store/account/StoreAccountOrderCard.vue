<script setup lang="ts">
import type { StoreOrderSummary } from '~/types/store-orders'

const props = defineProps<{
  order: StoreOrderSummary
}>()

const caption = computed(() => formatOrderDeliveryCaption(props.order))
const productTitle = computed(() => {
  const item = props.order.previewItem
  if (!item) return props.order.orderNumber

  return item.variantName
    ? `${item.productName} · ${item.variantName}`
    : item.productName
})
</script>

<template>
  <NuxtLink
    :to="`/cuenta/pedidos/${order.id}`"
    class="border-theme bg-theme-surface group flex flex-col overflow-hidden rounded-2xl border shadow-sm transition hover:shadow-md"
  >
    <div class="relative p-3 pb-0">
      <UiBadge
        :variant="orderStatusVariant(order.status)"
        class="absolute left-3 top-3 z-10 normal-case"
      >
        {{ formatOrderStatus(order.status) }}
      </UiBadge>

      <div class="bg-theme-muted relative mx-auto mt-8 aspect-square w-full max-w-[180px] overflow-hidden rounded-xl">
        <StoreImage
          v-if="order.previewItem?.imageUrl"
          :src="order.previewItem.imageUrl"
          :alt="productTitle"
          img-class="h-full w-full motion-safe:transition motion-safe:group-hover:scale-105"
          sizes="180px"
        />
        <div
          v-else
          class="text-theme-muted flex h-full items-center justify-center"
        >
          <UiIcon name="lucide:package" :size="40" />
        </div>
      </div>
    </div>

    <div class="flex flex-1 flex-col p-4 pt-3">
      <p class="text-theme line-clamp-2 text-sm font-semibold">
        {{ productTitle }}
      </p>
      <p class="text-theme-muted mt-1 text-xs capitalize">
        {{ caption }}
      </p>
      <div class="text-theme-muted mt-3 flex items-center justify-between text-xs">
        <span>{{ order.orderNumber }}</span>
        <span class="text-theme font-semibold">
          {{ formatPrice(order.total, order.currencyCode) }}
        </span>
      </div>
      <p
        v-if="order.extraItemsCount > 0"
        class="text-theme-muted mt-2 text-xs"
      >
        +{{ order.extraItemsCount }} producto{{ order.extraItemsCount === 1 ? '' : 's' }} más
      </p>
    </div>
  </NuxtLink>
</template>
