<script setup lang="ts">
import type { BreadcrumbItem } from '~/types/ui'

defineProps<{
  items: BreadcrumbItem[]
}>()
</script>

<template>
  <nav aria-label="Breadcrumb">
    <ol class="flex flex-wrap items-center gap-1 text-sm">
      <li
        v-for="(item, index) in items"
        :key="`${item.label}-${index}`"
        class="flex items-center gap-1"
      >
        <UiIcon
          v-if="index > 0"
          name="lucide:chevron-right"
          :size="14"
          class="text-admin-muted shrink-0"
        />
        <NuxtLink
          v-if="item.to && index < items.length - 1"
          :to="item.to"
          class="text-admin-muted hover:text-admin transition"
        >
          {{ item.label }}
        </NuxtLink>
        <span
          v-else
          class="text-admin font-medium"
          :class="index < items.length - 1 ? 'text-admin-muted font-normal' : ''"
        >
          {{ item.label }}
        </span>
      </li>
    </ol>
  </nav>
</template>
