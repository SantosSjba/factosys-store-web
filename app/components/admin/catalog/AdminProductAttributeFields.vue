<script setup lang="ts">
import type { EnrichedCategoryAttribute } from '~/utils/catalog/product-form'

const props = defineProps<{
  attributes: EnrichedCategoryAttribute[]
  modelValue: Record<string, string>
  disabled?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: Record<string, string>]
}>()

function updateAttribute(attributeId: string, value: string) {
  emit('update:modelValue', {
    ...props.modelValue,
    [attributeId]: value,
  })
}
</script>

<template>
  <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
    <AdminCatalogAttributeInput
      v-for="attribute in attributes"
      :key="attribute.attributeId"
      :attribute="attribute"
      :model-value="modelValue[attribute.attributeId] ?? ''"
      :disabled="disabled"
      @update:model-value="updateAttribute(attribute.attributeId, $event)"
    />
  </div>
</template>
