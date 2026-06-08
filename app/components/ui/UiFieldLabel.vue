<script setup lang="ts">
defineProps<{
  label: string
  required?: boolean
}>()
</script>

<template>
  <span class="text-theme text-sm font-medium">
    {{ label }}<span v-if="required" class="text-red-500" aria-hidden="true"> *</span>
  </span>
</template>
