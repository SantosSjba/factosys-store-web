<script setup lang="ts">
defineProps<{
  title?: string
  description?: string
  noPadding?: boolean
}>()
</script>

<template>
  <section
    class="border-admin-line rounded-2xl border bg-white"
    style="box-shadow: var(--admin-shadow-card)"
  >
    <div
      v-if="title || description || $slots.actions"
      class="border-admin-line flex flex-wrap items-start justify-between gap-3 border-b px-5 py-4 md:px-6"
    >
      <div>
        <h2 v-if="title" class="text-base font-semibold text-slate-900">{{ title }}</h2>
        <p v-if="description" class="mt-0.5 text-sm text-slate-500">{{ description }}</p>
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
