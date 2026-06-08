<script setup lang="ts">
import type { EnrichedCategoryAttribute } from '~/utils/catalog/product-form'

const props = defineProps<{
  attribute: EnrichedCategoryAttribute
  modelValue: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const label = computed(() => {
  const unit = props.attribute.unit ? ` (${props.attribute.unit})` : ''
  return `${props.attribute.attributeName}${unit}`
})

const booleanOptions = [
  { label: 'Sí', value: 'true' },
  { label: 'No', value: 'false' },
]

const selectOptions = computed(() =>
  props.attribute.options.map((option) => ({ label: option, value: option })),
)

const multiSelectValue = computed({
  get: () =>
    props.modelValue
      ? props.modelValue.split(',').map((item) => item.trim()).filter(Boolean)
      : [],
  set: (values: string[]) => emit('update:modelValue', values.join(', ')),
})
</script>

<template>
  <UiInput
    v-if="attribute.dataType === 'TEXT'"
    :model-value="modelValue"
    :label="label"
    :required="attribute.isRequired"
    :disabled="disabled"
    autocomplete="off"
    @update:model-value="emit('update:modelValue', $event)"
  />

  <UiInput
    v-else-if="attribute.dataType === 'NUMBER'"
    :model-value="modelValue"
    :label="label"
    type="number"
    step="any"
    :required="attribute.isRequired"
    :disabled="disabled"
    @update:model-value="emit('update:modelValue', $event)"
  />

  <UiSelect
    v-else-if="attribute.dataType === 'BOOLEAN'"
    :model-value="modelValue"
    :label="label"
    :options="booleanOptions"
    :required="attribute.isRequired"
    :disabled="disabled"
    @update:model-value="emit('update:modelValue', $event)"
  />

  <UiSelect
    v-else-if="attribute.dataType === 'SELECT'"
    :model-value="modelValue"
    :label="label"
    :options="selectOptions"
    :required="attribute.isRequired"
    :disabled="disabled"
    @update:model-value="emit('update:modelValue', $event)"
  />

  <UiCheckboxGroup
    v-else
    v-model="multiSelectValue"
    :label="label"
    :options="selectOptions"
    :required="attribute.isRequired"
    :disabled="disabled"
  />
</template>
