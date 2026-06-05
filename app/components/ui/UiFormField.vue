<script setup lang="ts">
defineProps<{
  label?: string
  hint?: string
  error?: string
  required?: boolean
}>()
</script>

<template>
  <div class="space-y-1.5">
    <span v-if="label" class="text-theme text-sm font-medium">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </span>
    <slot />
    <UiFieldMessage :error="error" :hint="hint" />
  </div>
</template>
