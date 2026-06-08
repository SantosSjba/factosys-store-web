<script setup lang="ts">
import { useField } from 'vee-validate'

const props = withDefaults(
  defineProps<{
    name: string
    label?: string
    type?: string
    hint?: string
    autocomplete?: string
    placeholder?: string
    disabled?: boolean
    maxlength?: number | string
    required?: boolean
  }>(),
  { type: 'text' },
)

const { value, errorMessage, handleChange, handleBlur } = useField<string>(
  () => props.name,
)
</script>

<template>
  <UiInput
    :model-value="value"
    :label="label"
    :type="type"
    :hint="hint"
    :autocomplete="autocomplete"
    :placeholder="placeholder"
    :disabled="disabled"
    :maxlength="maxlength"
    :required="required"
    :error="errorMessage"
    @update:model-value="handleChange"
    @blur="handleBlur"
  />
</template>
