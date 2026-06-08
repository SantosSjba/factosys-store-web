<script setup lang="ts">
import type { UiChoiceOption } from '~/types/ui'

const props = defineProps<{
  modelValue: string[]
  label?: string
  options: UiChoiceOption[]
  required?: boolean
  hint?: string
  error?: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

function isChecked(value: string) {
  return props.modelValue.includes(value)
}

function onToggle(value: string, checked: boolean) {
  if (checked) {
    emit('update:modelValue', [...props.modelValue, value])
    return
  }
  emit(
    'update:modelValue',
    props.modelValue.filter((item) => item !== value),
  )
}
</script>

<template>
  <fieldset class="space-y-3" :disabled="disabled">
    <legend v-if="label" class="mb-1">
      <UiFieldLabel :label="label" :required="required" />
    </legend>
    <UiCheckbox
      v-for="option in options"
      :key="option.value"
      :model-value="isChecked(option.value)"
      :label="option.label"
      :hint="option.hint"
      :disabled="disabled || option.disabled"
      @update:model-value="onToggle(option.value, $event)"
    />
    <UiFieldMessage :error="error" :hint="hint" />
  </fieldset>
</template>
