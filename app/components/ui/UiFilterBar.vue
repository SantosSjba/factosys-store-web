<script setup lang="ts">
defineProps<{
  title?: string
}>()
</script>

<template>
  <div
    class="border-theme bg-theme-surface mb-4 flex flex-wrap items-end gap-3 rounded-xl border p-4"
  >
    <p v-if="title" class="text-theme w-full text-sm font-semibold">{{ title }}</p>
    <slot />
    <div v-if="$slots.actions" class="ml-auto flex flex-wrap gap-2">
      <slot name="actions" />
    </div>
  </div>
</template>
