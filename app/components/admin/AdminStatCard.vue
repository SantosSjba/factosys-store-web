<script setup lang="ts">
import type { AdminNavIconName } from '~/constants/admin-nav'

defineProps<{
  label: string
  value: string | number
  hint?: string
  icon?: AdminNavIconName
  trend?: string
  trendUp?: boolean
}>()
</script>

<template>
  <article
    class="border-admin-line rounded-2xl border bg-white p-5 md:p-6"
    style="box-shadow: var(--admin-shadow-card)"
  >
    <div class="flex items-start justify-between gap-3">
      <div
        v-if="icon"
        class="flex h-11 w-11 items-center justify-center rounded-xl"
        style="background: var(--admin-primary-soft); color: var(--admin-primary)"
      >
        <AdminNavIcon :name="icon" />
      </div>
      <span
        v-if="trend"
        class="ml-auto inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
        :class="trendUp ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'"
      >
        {{ trend }}
      </span>
    </div>
    <p class="mt-4 text-sm font-medium text-slate-500">{{ label }}</p>
    <p class="mt-1 text-2xl font-bold tracking-tight text-slate-900">{{ value }}</p>
    <p v-if="hint" class="mt-1 text-xs text-slate-400">{{ hint }}</p>
  </article>
</template>
