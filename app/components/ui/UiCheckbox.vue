<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  label: string
  hint?: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const id = `checkbox-${useId()}`
</script>

<template>
  <label class="flex cursor-pointer items-start gap-3" :for="id">
    <input
      :id="id"
      type="checkbox"
      class="border-store-line text-brand-accent mt-0.5 h-4 w-4 rounded focus:ring-[var(--brand-cyan)]"
      :checked="modelValue"
      :disabled="disabled"
      @change="emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
    />
    <span class="min-w-0">
      <span class="text-theme block text-sm font-medium">{{ label }}</span>
      <span v-if="hint" class="text-theme-muted mt-0.5 block text-xs">{{ hint }}</span>
    </span>
  </label>
</template>
