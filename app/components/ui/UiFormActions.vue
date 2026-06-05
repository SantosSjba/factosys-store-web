<script setup lang="ts">
withDefaults(
  defineProps<{
    submitLabel?: string
    cancelLabel?: string
    loading?: boolean
    sticky?: boolean
  }>(),
  {
    submitLabel: 'Guardar',
    cancelLabel: 'Cancelar',
    loading: false,
    sticky: false,
  },
)

const emit = defineEmits<{
  cancel: []
  submit: []
}>()
</script>

<template>
  <div
    class="flex flex-wrap items-center justify-end gap-2 border-t pt-4"
    :class="[
      sticky
        ? 'border-theme bg-theme-surface sticky bottom-0 -mx-4 mt-6 px-4 py-4 md:-mx-6 md:px-6'
        : 'border-transparent',
    ]"
  >
    <UiButton variant="ghost" type="button" :disabled="loading" @click="emit('cancel')">
      {{ cancelLabel }}
    </UiButton>
    <UiButton type="submit" :loading="loading" @click="emit('submit')">
      {{ submitLabel }}
    </UiButton>
  </div>
</template>
