<script setup lang="ts">
defineProps<{
  modelValue: string
  value: string
  label: string
  name: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const id = `radio-${useId()}`
</script>

<template>
  <label
    class="flex items-center gap-3"
    :class="disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'"
    :for="id"
  >
    <input
      :id="id"
      type="radio"
      :name="name"
      class="border-store-line text-brand-accent h-4 w-4 focus:ring-[var(--brand-cyan)]"
      :value="value"
      :checked="modelValue === value"
      :disabled="disabled"
      @change="emit('update:modelValue', value)"
    />
    <span class="text-theme text-sm">{{ label }}</span>
  </label>
</template>
