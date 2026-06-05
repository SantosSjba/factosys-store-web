<script setup lang="ts">
defineProps<{
  error?: string
  hint?: string
}>()
</script>

<template>
  <p v-if="error" class="text-xs text-red-500" role="alert">{{ error }}</p>
  <p v-else-if="hint" class="text-theme-muted text-xs">{{ hint }}</p>
</template>
