<script setup lang="ts">
defineProps<{
  title?: string
  description?: string
  noPadding?: boolean
}>()
</script>

<template>
  <section
    class="border-admin-line bg-admin-card rounded-2xl border"
    style="box-shadow: var(--admin-shadow-card)"
  >
    <div
      v-if="title || description || $slots.actions"
      class="border-admin-line flex flex-wrap items-start justify-between gap-3 border-b px-5 py-4 md:px-6"
    >
      <div>
        <h2 v-if="title" class="text-admin text-base font-semibold">{{ title }}</h2>
        <p v-if="description" class="text-admin-muted mt-0.5 text-sm">{{ description }}</p>
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
