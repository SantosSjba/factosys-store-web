<script setup lang="ts">
defineProps<{
  title?: string
  description?: string
  noPadding?: boolean
}>()
</script>

<template>
  <section class="border-theme bg-theme-surface rounded-2xl border shadow-sm">
    <div
      v-if="title || description || $slots.actions"
      class="border-theme flex flex-wrap items-start justify-between gap-3 border-b px-5 py-4 md:px-6"
    >
      <div>
        <h2 v-if="title" class="text-theme text-base font-semibold">{{ title }}</h2>
        <p v-if="description" class="text-theme-muted mt-0.5 text-sm">{{ description }}</p>
      </div>
      <div v-if="$slots.actions" class="flex items-center gap-2">
        <slot name="actions" />
      </div>
    </div>
    <div :class="noPadding ? '' : 'p-5 md:p-6'">
      <slot />
    </div>
  </section>
</template>
