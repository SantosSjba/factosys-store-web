<script setup lang="ts">
import type { StoreCategoryNode } from '~/types/store'

defineProps<{
  categories: StoreCategoryNode[]
  loading?: boolean
}>()
</script>

<template>
  <section class="border-theme bg-theme-surface border-y">
    <div class="mx-auto max-w-7xl px-4 py-4">
      <div
        v-if="loading"
        class="flex gap-3 overflow-hidden"
      >
        <UiSkeleton
          v-for="index in 6"
          :key="index"
          tone="store"
          height="2.25rem"
          width="6rem"
          rounded="full"
        />
      </div>

      <div
        v-else-if="categories.length > 0"
        class="scrollbar-thin flex gap-2 overflow-x-auto pb-1 sm:gap-3"
      >
        <NuxtLink
          v-for="category in categories"
          :key="category.id"
          :to="{ path: '/productos', query: { categoria: category.slug } }"
          class="border-theme bg-theme-muted text-theme hover:border-brand-accent hover:text-brand-accent shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition"
        >
          {{ category.name }}
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
