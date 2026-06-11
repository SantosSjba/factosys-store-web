<script setup lang="ts">
const props = defineProps<{
  productName: string
  variantName?: string | null
  productSlug: string
  price: number
  compareAtPrice?: number | null
  quantity: number
  maxQuantity?: number
  imageUrl?: string | null
  loading?: boolean
  currency?: string
}>()

const emit = defineEmits<{
  'update:quantity': [value: number]
  remove: []
}>()

const displayTitle = computed(() => {
  if (props.variantName && props.variantName !== props.productName) {
    return `${props.productName} — ${props.variantName}`
  }
  return props.productName
})
</script>

<template>
  <div
    class="border-theme flex gap-3 border-b py-4 last:border-b-0"
    :class="loading && 'opacity-70'"
  >
    <NuxtLink
      :to="`/productos/${productSlug}`"
      class="bg-theme-muted h-20 w-20 shrink-0 overflow-hidden rounded-lg sm:h-24 sm:w-24"
    >
      <StoreImage
        v-if="imageUrl"
        :src="imageUrl"
        :alt="displayTitle"
        img-class="h-full w-full"
        fit="cover"
      />
      <div
        v-else
        class="text-theme-muted flex h-full items-center justify-center"
      >
        <UiIcon name="lucide:image" :size="24" />
      </div>
    </NuxtLink>

    <div class="min-w-0 flex-1">
      <NuxtLink
        :to="`/productos/${productSlug}`"
        class="text-theme line-clamp-2 text-sm font-medium hover:underline sm:text-base"
      >
        {{ displayTitle }}
      </NuxtLink>

      <UiPrice
        :price="price"
        :compare-at="compareAtPrice"
        :currency="currency"
        class="mt-1"
      />

      <div class="mt-3 flex flex-wrap items-center justify-between gap-2">
        <UiQuantityStepper
          :model-value="quantity"
          :max="maxQuantity ?? 99"
          :disabled="loading"
          @update:model-value="emit('update:quantity', $event)"
        />
        <button
          type="button"
          class="text-theme-muted inline-flex items-center gap-1 text-xs hover:text-red-500 disabled:opacity-50"
          :disabled="loading"
          @click="emit('remove')"
        >
          <UiIcon name="lucide:trash-2" :size="14" />
          Quitar
        </button>
      </div>
    </div>
  </div>
</template>
