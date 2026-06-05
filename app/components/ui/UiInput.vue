<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: string
    label?: string
    type?: string
    placeholder?: string
    autocomplete?: string
    required?: boolean
    hint?: string
    error?: string
    disabled?: boolean
    id?: string
  }>(),
  { type: 'text' },
)

defineEmits<{
  'update:modelValue': [value: string]
}>()

const inputId = computed(() => props.id ?? `input-${useId()}`)

const fieldClass = computed(() => [
  'border-store-line bg-theme-surface text-theme placeholder:text-theme-muted w-full rounded-lg border px-3 py-2.5 text-sm shadow-sm transition focus:outline-none focus:ring-2',
  props.error
    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
    : 'focus:border-[var(--brand-cyan)] focus:ring-[color-mix(in_srgb,var(--brand-cyan)_25%,transparent)]',
  props.disabled && 'cursor-not-allowed opacity-60',
])
</script>

<template>
  <label v-if="label" class="block space-y-1.5" :for="inputId">
    <span class="text-theme text-sm font-medium">{{ label }}</span>
    <input
      :id="inputId"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :required="required"
      :disabled="disabled"
      :class="fieldClass"
      :aria-invalid="Boolean(error)"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <UiFieldMessage :error="error" :hint="hint" />
  </label>
  <div v-else class="space-y-1.5">
    <input
      :id="inputId"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :required="required"
      :disabled="disabled"
      :class="fieldClass"
      :aria-invalid="Boolean(error)"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <UiFieldMessage :error="error" :hint="hint" />
  </div>
</template>
