<script setup lang="ts">
const { isLoading, message } = useLoading()
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isLoading"
      class="fixed inset-0 z-[10002] flex items-center justify-center bg-slate-900/40 backdrop-blur-[1px]"
      role="alert"
      aria-busy="true"
      :aria-label="message || 'Cargando'"
    >
      <div class="bg-theme-surface border-theme flex flex-col items-center gap-3 rounded-2xl border px-6 py-5 shadow-xl">
        <UiSpinner size="lg" />
        <p v-if="message" class="text-theme text-sm font-medium">{{ message }}</p>
      </div>
    </div>
  </Teleport>
</template>
