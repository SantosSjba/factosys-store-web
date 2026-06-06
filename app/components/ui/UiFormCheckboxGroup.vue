<script setup lang="ts">
import { useField } from 'vee-validate'
import type { UiChoiceOption } from '~/types/ui'

const props = defineProps<{
  name: string
  label?: string
  options: UiChoiceOption[]
  hint?: string
  disabled?: boolean
}>()

const { value, errorMessage, handleChange } = useField<string[]>(() => props.name)

function onUpdate(next: string[]) {
  handleChange(next)
}
</script>

<template>
  <UiCheckboxGroup
    :model-value="value ?? []"
    :label="label"
    :options="options"
    :hint="hint"
    :disabled="disabled"
    :error="errorMessage"
    @update:model-value="onUpdate"
  />
</template>
