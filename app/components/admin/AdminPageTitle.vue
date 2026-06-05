<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>

<template>
  <div class="mb-6">
    <h1 class="text-admin text-2xl font-bold tracking-tight">{{ title }}</h1>
    <p v-if="description" class="text-admin-muted mt-1 text-sm">{{ description }}</p>
  </div>
</template>
