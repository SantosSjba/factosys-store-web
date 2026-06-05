<script setup lang="ts">
defineProps<{
  danger?: boolean
  disabled?: boolean
}>()
</script>

<template>
  <button
    type="button"
    class="text-theme flex w-full items-center gap-2 px-4 py-2 text-left text-sm transition disabled:cursor-not-allowed disabled:opacity-50"
    :class="
      danger
        ? 'text-red-600 hover:bg-red-500/10 dark:text-red-400'
        : 'hover:bg-theme-muted'
    "
    :disabled="disabled"
  >
    <slot />
  </button>
</template>
