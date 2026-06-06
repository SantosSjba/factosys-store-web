<script setup lang="ts">
import { useField } from 'vee-validate'
import type { UiSelectOption } from '~/types/ui'

const props = defineProps<{
  name: string
  label?: string
  options: UiSelectOption[]
  hint?: string
  placeholder?: string
  disabled?: boolean
}>()

const { value, errorMessage, handleChange, handleBlur } = useField<string>(
  () => props.name,
)
</script>

<template>
  <UiSelect
    :model-value="value"
    :label="label"
    :options="options"
    :hint="hint"
    :placeholder="placeholder"
    :disabled="disabled"
    :error="errorMessage"
    @update:model-value="handleChange"
    @blur="handleBlur"
  />
</template>
