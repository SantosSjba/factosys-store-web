<script setup lang="ts">
defineProps<{
  variant?: 'error' | 'success' | 'info'
}>()
</script>

<template>
  <div
    class="rounded-lg border px-4 py-3 text-sm"
    :class="{
      'border-red-200 bg-red-50 text-red-800': variant === 'error',
      'border-emerald-200 bg-emerald-50 text-emerald-800': variant === 'success',
      'border-sky-200 bg-sky-50 text-sky-800': variant === 'info' || !variant,
    }"
    role="alert"
  >
    <slot />
  </div>
</template>
