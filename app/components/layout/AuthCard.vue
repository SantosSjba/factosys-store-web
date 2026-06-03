<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
}>()
</script>

<template>
  <div class="mx-auto w-full max-w-md">
    <div class="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <div class="mb-6 text-center">
        <h1 class="text-2xl font-bold text-slate-900">{{ title }}</h1>
        <p v-if="subtitle" class="mt-2 text-sm text-slate-600">{{ subtitle }}</p>
      </div>
      <slot />
    </div>
  </div>
</template>
