<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
}>()
</script>

<template>
  <div class="mx-auto w-full max-w-md">
    <div class="border-theme bg-theme-surface rounded-2xl border p-8 shadow-sm">
      <div class="mb-6 text-center">
        <h1 class="text-theme text-2xl font-bold">{{ title }}</h1>
        <p v-if="subtitle" class="text-theme-muted mt-2 text-sm">{{ subtitle }}</p>
      </div>
      <slot />
    </div>
  </div>
</template>
