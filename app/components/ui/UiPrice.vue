<script setup lang="ts">
const props = defineProps<{
  price: number
  compareAt?: number
  currency?: string
}>()

const formatter = computed(
  () =>
    new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: props.currency || 'PEN',
    }),
)

const formatted = computed(() => formatter.value.format(props.price))
const formattedCompare = computed(() =>
  props.compareAt ? formatter.value.format(props.compareAt) : null,
)

const hasDiscount = computed(
  () => props.compareAt !== undefined && props.compareAt > props.price,
)
</script>

<template>
  <div class="flex flex-wrap items-baseline gap-2">
    <span class="text-theme text-lg font-bold">{{ formatted }}</span>
    <span
      v-if="hasDiscount && formattedCompare"
      class="text-theme-muted text-sm line-through"
    >
      {{ formattedCompare }}
    </span>
    <UiBadge v-if="hasDiscount" variant="danger" size="md">Oferta</UiBadge>
  </div>
</template>
