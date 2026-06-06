<script setup lang="ts">
import type { UiSelectOption } from '~/types/ui'

const props = defineProps<{
  modelValue: string
  label?: string
  options: UiSelectOption[]
  required?: boolean
  hint?: string
  error?: string
  disabled?: boolean
  placeholder?: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
  blur: []
}>()

const selectClass = computed(() => [
  'border-store-line bg-theme-surface text-theme w-full appearance-none rounded-lg border px-3 py-2.5 pr-10 text-sm shadow-sm transition focus:outline-none focus:ring-2',
  props.error
    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
    : 'focus:border-[var(--brand-cyan)] focus:ring-[color-mix(in_srgb,var(--brand-cyan)_25%,transparent)]',
  props.disabled && 'cursor-not-allowed opacity-60',
])
</script>

<template>
  <label v-if="label" class="block space-y-1.5">
    <span class="text-theme text-sm font-medium">{{ label }}</span>
    <div class="relative">
      <select
        :value="modelValue"
        :required="required"
        :disabled="disabled"
        :class="selectClass"
        :aria-invalid="Boolean(error)"
        @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
        @blur="$emit('blur')"
      >
        <option v-if="placeholder" disabled value="">{{ placeholder }}</option>
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
          :disabled="option.disabled"
        >
          {{ option.label }}
        </option>
      </select>
      <UiIcon
        name="lucide:chevron-down"
        :size="16"
        class="text-theme-muted pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
      />
    </div>
    <UiFieldMessage :error="error" :hint="hint" />
  </label>
  <div v-else class="space-y-1.5">
    <div class="relative">
      <select
        :value="modelValue"
        :required="required"
        :disabled="disabled"
        :class="selectClass"
        :aria-invalid="Boolean(error)"
        @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
        @blur="$emit('blur')"
      >
        <option v-if="placeholder" disabled value="">{{ placeholder }}</option>
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
          :disabled="option.disabled"
        >
          {{ option.label }}
        </option>
      </select>
      <UiIcon
        name="lucide:chevron-down"
        :size="16"
        class="text-theme-muted pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
      />
    </div>
    <UiFieldMessage :error="error" :hint="hint" />
  </div>
</template>
