<script setup lang="ts">
defineProps<{
  modelValue: string
  label: string
  rows?: number
  placeholder?: string
  required?: boolean
  hint?: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()

const textareaId = `textarea-${useId()}`
</script>

<template>
  <label class="block space-y-1.5" :for="textareaId">
    <span class="text-theme text-sm font-medium">{{ label }}</span>
    <textarea
      :id="textareaId"
      :value="modelValue"
      :rows="rows ?? 4"
      :placeholder="placeholder"
      :required="required"
      class="border-store-line bg-theme-surface text-theme placeholder:text-theme-muted w-full resize-y rounded-lg border px-3 py-2.5 text-sm shadow-sm transition focus:border-[var(--brand-cyan)] focus:outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--brand-cyan)_25%,transparent)]"
      @input="
        $emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)
      "
    />
    <span v-if="hint" class="text-theme-muted text-xs">{{ hint }}</span>
  </label>
</template>
