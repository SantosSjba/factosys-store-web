<script setup lang="ts">
import type { BreadcrumbItem } from '~/types/ui'

const props = withDefaults(
  defineProps<{
    items: BreadcrumbItem[]
    tone?: 'admin' | 'store'
  }>(),
  { tone: 'admin' },
)

const linkClass = computed(() =>
  props.tone === 'admin'
    ? 'text-admin-muted hover:text-admin transition'
    : 'text-theme-muted hover:text-theme transition',
)

const currentClass = computed(() =>
  props.tone === 'admin' ? 'text-admin font-medium' : 'text-theme font-medium',
)

const separatorClass = computed(() =>
  props.tone === 'admin' ? 'text-admin-muted' : 'text-theme-muted',
)
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
          :class="separatorClass"
          class="shrink-0"
        />
        <NuxtLink
          v-if="item.to && index < items.length - 1"
          :to="item.to"
          :class="linkClass"
        >
          {{ item.label }}
        </NuxtLink>
        <span
          v-else
          :class="currentClass"
        >
          {{ item.label }}
        </span>
      </li>
    </ol>
  </nav>
</template>
