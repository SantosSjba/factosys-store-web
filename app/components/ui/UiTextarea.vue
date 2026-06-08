<script setup lang="ts">
const props = defineProps<{
  modelValue: string
  label?: string
  rows?: number
  placeholder?: string
  required?: boolean
  hint?: string
  error?: string
  disabled?: boolean
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()

const textareaId = `textarea-${useId()}`

const fieldClass = computed(() => [
  'border-store-line bg-theme-surface text-theme placeholder:text-theme-muted w-full resize-y rounded-lg border px-3 py-2.5 text-sm shadow-sm transition focus:outline-none focus:ring-2',
  props.error
    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
    : 'focus:border-[var(--brand-cyan)] focus:ring-[color-mix(in_srgb,var(--brand-cyan)_25%,transparent)]',
  props.disabled && 'cursor-not-allowed opacity-60',
])
</script>

<template>
  <label class="block space-y-1.5" :for="textareaId">
    <UiFieldLabel v-if="label" :label="label" :required="required" />
    <textarea
      :id="textareaId"
      :value="modelValue"
      :rows="rows ?? 4"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :class="fieldClass"
      :aria-invalid="Boolean(error)"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    />
    <UiFieldMessage :error="error" :hint="hint" />
  </label>
</template>
