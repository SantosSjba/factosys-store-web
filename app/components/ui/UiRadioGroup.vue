<script setup lang="ts">
import type { UiChoiceOption } from '~/types/ui'

const props = withDefaults(
  defineProps<{
    modelValue: string
    label?: string
    name?: string
    options: UiChoiceOption[]
    hint?: string
    error?: string
    disabled?: boolean
    layout?: 'vertical' | 'horizontal'
  }>(),
  { layout: 'vertical' },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const groupName = computed(() => props.name ?? `radio-group-${useId()}`)
</script>

<template>
  <fieldset class="space-y-2" :disabled="disabled">
    <legend v-if="label" class="text-theme mb-1 text-sm font-medium">{{ label }}</legend>
    <div
      class="flex gap-4"
      :class="layout === 'vertical' ? 'flex-col' : 'flex-wrap items-center'"
    >
      <UiRadio
        v-for="option in options"
        :key="option.value"
        :model-value="modelValue"
        :value="option.value"
        :label="option.label"
        :name="groupName"
        :disabled="disabled || option.disabled"
        @update:model-value="emit('update:modelValue', $event)"
      />
    </div>
    <UiFieldMessage :error="error" :hint="hint" />
  </fieldset>
</template>
