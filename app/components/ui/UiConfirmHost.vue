<script setup lang="ts">
const { state, close } = useConfirm()
</script>

<template>
  <UiConfirmDialog
    :model-value="state.open"
    :title="state.title"
    :message="state.message"
    :confirm-label="state.confirmLabel"
    :cancel-label="state.cancelLabel"
    :variant="state.variant"
    :loading="state.loading"
    @update:model-value="(v) => !v && close(false)"
    @confirm="close(true)"
  />
</template>
