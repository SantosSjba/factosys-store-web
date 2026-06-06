<script setup lang="ts">
withDefaults(
  defineProps<{
    submitLabel?: string
    cancelLabel?: string
    loading?: boolean
    showSubmit?: boolean
  }>(),
  {
    submitLabel: 'Guardar',
    cancelLabel: 'Cancelar',
    loading: false,
    showSubmit: true,
  },
)

const emit = defineEmits<{
  cancel: []
  submit: []
}>()
</script>

<template>
  <UiButton variant="ghost" :disabled="loading" @click="emit('cancel')">
    {{ cancelLabel }}
  </UiButton>
  <UiButton
    v-if="showSubmit"
    :loading="loading"
    @click="emit('submit')"
  >
    {{ submitLabel }}
  </UiButton>
</template>
