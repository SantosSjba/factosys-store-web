<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    value: number
    max?: number
    showValue?: boolean
  }>(),
  { max: 5, showValue: true },
)

const stars = computed(() => Array.from({ length: props.max }, (_, i) => i + 1))
</script>

<template>
  <div class="inline-flex items-center gap-1">
    <UiIcon
      v-for="star in stars"
      :key="star"
      name="lucide:star"
      :size="16"
      :class="star <= Math.round(value) ? 'text-amber-400' : 'text-theme-muted opacity-40'"
    />
    <span v-if="showValue" class="text-theme-muted ml-1 text-xs">
      {{ value.toFixed(1) }}
    </span>
  </div>
</template>
