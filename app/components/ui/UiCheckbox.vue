<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  label: string
  hint?: string
  error?: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const id = `checkbox-${useId()}`
</script>

<template>
  <div class="space-y-1">
    <label
      class="flex items-start gap-3"
      :class="disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'"
      :for="id"
    >
      <input
        :id="id"
        type="checkbox"
        class="border-store-line text-brand-accent mt-0.5 h-4 w-4 shrink-0 rounded focus:ring-[var(--brand-cyan)]"
        :class="error && 'border-red-500'"
        :checked="modelValue"
        :disabled="disabled"
        :aria-invalid="Boolean(error)"
        @change="emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
      />
      <span class="min-w-0">
        <span class="text-theme block text-sm font-medium">{{ label }}</span>
      </span>
    </label>
    <div class="pl-7">
      <UiFieldMessage :error="error" :hint="hint" />
    </div>
  </div>
</template>
