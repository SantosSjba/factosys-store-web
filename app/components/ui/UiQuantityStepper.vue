<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: number
    min?: number
    max?: number
  }>(),
  { min: 1, max: 99 },
)

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

function decrement() {
  emit('update:modelValue', Math.max(props.min, props.modelValue - 1))
}

function increment() {
  emit('update:modelValue', Math.min(props.max, props.modelValue + 1))
}
</script>

<template>
  <div class="border-theme inline-flex items-center overflow-hidden rounded-lg border">
    <button
      type="button"
      class="text-theme hover:bg-theme-muted px-3 py-2 transition disabled:opacity-40"
      :disabled="modelValue <= min"
      aria-label="Disminuir cantidad"
      @click="decrement"
    >
      <UiIcon name="lucide:minus" :size="16" />
    </button>
    <span class="text-theme min-w-[2.5rem] px-2 text-center text-sm font-semibold">
      {{ modelValue }}
    </span>
    <button
      type="button"
      class="text-theme hover:bg-theme-muted px-3 py-2 transition disabled:opacity-40"
      :disabled="modelValue >= max"
      aria-label="Aumentar cantidad"
      @click="increment"
    >
      <UiIcon name="lucide:plus" :size="16" />
    </button>
  </div>
</template>
