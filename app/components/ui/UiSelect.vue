<script setup lang="ts">
export type UiSelectOption = {
  label: string
  value: string
  disabled?: boolean
}

defineProps<{
  modelValue: string
  label: string
  options: UiSelectOption[]
  required?: boolean
  hint?: string
  placeholder?: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <label class="block space-y-1.5">
    <span class="text-theme text-sm font-medium">{{ label }}</span>
    <div class="relative">
      <select
        :value="modelValue"
        :required="required"
        class="border-store-line bg-theme-surface text-theme w-full appearance-none rounded-lg border px-3 py-2.5 pr-10 text-sm shadow-sm transition focus:border-[var(--brand-cyan)] focus:outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--brand-cyan)_25%,transparent)]"
        @change="
          $emit('update:modelValue', ($event.target as HTMLSelectElement).value)
        "
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
    <span v-if="hint" class="text-theme-muted text-xs">{{ hint }}</span>
  </label>
</template>
