<script setup lang="ts">
import type { BreadcrumbItem } from '~/types/ui'

defineProps<{
  title: string
  description?: string
  breadcrumb?: BreadcrumbItem[]
}>()
</script>

<template>
  <div class="mb-6 flex flex-wrap items-start justify-between gap-4">
    <div class="min-w-0">
      <UiBreadcrumb v-if="breadcrumb?.length" :items="breadcrumb" class="mb-3" />
      <h1 class="text-theme text-2xl font-bold tracking-tight">{{ title }}</h1>
      <p v-if="description" class="text-theme-muted mt-1 text-sm">{{ description }}</p>
    </div>
    <div v-if="$slots.actions" class="flex flex-wrap items-center gap-2">
      <slot name="actions" />
    </div>
  </div>
</template>
