<script setup lang="ts">
defineProps<{
  title?: string
  description?: string
}>()

const emit = defineEmits<{
  retry: []
}>()
</script>

<template>
  <div class="flex flex-col items-center px-6 py-12 text-center">
    <div class="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
      <UiIcon name="lucide:triangle-alert" :size="28" />
    </div>
    <h3 class="text-theme text-lg font-semibold">
      {{ title || 'Algo salió mal' }}
    </h3>
    <p class="text-theme-muted mt-2 max-w-md text-sm">
      {{
        description ||
          'No pudimos cargar la información. Intenta de nuevo en unos segundos.'
      }}
    </p>
    <UiButton class="mt-5" variant="secondary" icon="lucide:refresh-cw" @click="emit('retry')">
      Reintentar
    </UiButton>
  </div>
</template>
