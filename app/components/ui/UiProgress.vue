<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    value: number
    max?: number
    label?: string
    showValue?: boolean
  }>(),
  { max: 100, showValue: true },
)

const percent = computed(() =>
  Math.min(100, Math.max(0, (props.value / props.max) * 100)),
)
</script>

<template>
  <div class="w-full">
    <div v-if="label || showValue" class="mb-1.5 flex items-center justify-between gap-2">
      <span v-if="label" class="text-theme text-sm font-medium">{{ label }}</span>
      <span v-if="showValue" class="text-theme-muted text-xs">{{ Math.round(percent) }}%</span>
    </div>
    <div class="bg-theme-muted h-2 w-full overflow-hidden rounded-full">
      <div
        class="bg-brand-accent h-full rounded-full transition-all duration-300"
        :style="{ width: `${percent}%` }"
        role="progressbar"
        :aria-valuenow="value"
        :aria-valuemin="0"
        :aria-valuemax="max"
      />
    </div>
  </div>
</template>
