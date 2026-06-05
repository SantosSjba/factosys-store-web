<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title: string
    message: string
    confirmLabel?: string
    cancelLabel?: string
    variant?: 'danger' | 'primary'
    loading?: boolean
  }>(),
  {
    confirmLabel: 'Confirmar',
    cancelLabel: 'Cancelar',
    variant: 'primary',
    loading: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
}>()

function close() {
  emit('update:modelValue', false)
}

function onConfirm() {
  emit('confirm')
}
</script>

<template>
  <UiModal
    :model-value="modelValue"
    :title="title"
    size="sm"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <p class="text-admin-muted text-sm">{{ message }}</p>
    <template #footer>
      <UiButton variant="ghost" :disabled="loading" @click="close">
        {{ cancelLabel }}
      </UiButton>
      <UiButton
        :variant="variant === 'danger' ? 'primary' : 'primary'"
        :loading="loading"
        :class="variant === 'danger' ? '!bg-red-600 hover:!opacity-90' : ''"
        @click="onConfirm"
      >
        {{ confirmLabel }}
      </UiButton>
    </template>
  </UiModal>
</template>
