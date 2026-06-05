<script setup lang="ts">
defineProps<{
  label: string
  value: string | number
  hint?: string
  icon?: string
  trend?: string
  trendUp?: boolean
}>()
</script>

<template>
  <article
    class="border-theme bg-theme-surface rounded-2xl border p-5 shadow-sm md:p-6"
  >
    <div class="flex items-start justify-between gap-3">
      <div
        v-if="icon"
        class="bg-brand-accent-soft text-brand-accent flex h-11 w-11 items-center justify-center rounded-xl"
      >
        <UiIcon :name="icon" :size="22" />
      </div>
      <span
        v-if="trend"
        class="ml-auto inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
        :class="trendUp ? 'bg-emerald-500/15 text-emerald-500' : 'bg-red-500/15 text-red-500'"
      >
        {{ trend }}
      </span>
    </div>
    <p class="text-theme-muted mt-4 text-sm font-medium">{{ label }}</p>
    <p class="text-theme mt-1 text-2xl font-bold tracking-tight">{{ value }}</p>
    <p v-if="hint" class="text-theme-muted mt-1 text-xs">{{ hint }}</p>
  </article>
</template>
