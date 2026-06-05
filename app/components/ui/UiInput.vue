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
    id?: string
  }>(),
  { type: 'text' },
)

defineEmits<{
  'update:modelValue': [value: string]
}>()

const inputId = computed(() => props.id ?? `input-${useId()}`)
</script>

<template>
  <label class="block space-y-1.5" :for="inputId">
    <span v-if="label" class="text-theme text-sm font-medium">{{ label }}</span>
    <input
      :id="inputId"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :required="required"
      class="border-store-line bg-theme-surface text-theme placeholder:text-theme-muted w-full rounded-lg border px-3 py-2.5 text-sm shadow-sm transition focus:border-[var(--brand-cyan)] focus:outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--brand-cyan)_25%,transparent)]"
      @input="
        $emit('update:modelValue', ($event.target as HTMLInputElement).value)
      "
    />
    <span v-if="hint" class="text-theme-muted text-xs">{{ hint }}</span>
  </label>
</template>
