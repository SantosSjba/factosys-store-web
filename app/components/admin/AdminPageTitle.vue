<script setup lang="ts">
import type { BreadcrumbItem } from '~/types/ui'

const props = defineProps<{
  title: string
  description?: string
  breadcrumb?: BreadcrumbItem[]
}>()

const autoBreadcrumb = useAdminBreadcrumb()

const breadcrumbItems = computed(() => props.breadcrumb ?? autoBreadcrumb.value)
</script>

<template>
  <div class="mb-6">
    <UiBreadcrumb
      v-if="breadcrumbItems.length"
      :items="breadcrumbItems"
      class="mb-3"
    />
    <h1 class="text-admin text-2xl font-bold tracking-tight">{{ title }}</h1>
    <p v-if="description" class="text-admin-muted mt-1 text-sm">{{ description }}</p>
  </div>
</template>
