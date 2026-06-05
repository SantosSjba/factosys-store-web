<script setup lang="ts">
defineProps<{
  title: string
  price: number
  compareAt?: number
  imageUrl?: string
  rating?: number
  badge?: string
  to?: string
}>()
</script>

<template>
  <article class="border-theme bg-theme-surface group overflow-hidden rounded-xl border shadow-sm transition hover:shadow-md">
    <NuxtLink :to="to || '#'" class="block">
      <div class="bg-theme-muted relative aspect-square overflow-hidden">
        <img
          v-if="imageUrl"
          :src="imageUrl"
          :alt="title"
          class="h-full w-full object-cover transition group-hover:scale-105"
        />
        <div
          v-else
          class="text-theme-muted flex h-full items-center justify-center"
        >
          <UiIcon name="lucide:image" :size="40" />
        </div>
        <UiBadge
          v-if="badge"
          variant="primary"
          class="absolute left-2 top-2 normal-case"
        >
          {{ badge }}
        </UiBadge>
      </div>
      <div class="space-y-2 p-4">
        <h3 class="text-theme line-clamp-2 text-sm font-medium">{{ title }}</h3>
        <UiRating v-if="rating !== undefined" :value="rating" :show-value="false" />
        <UiPrice :price="price" :compare-at="compareAt" />
      </div>
    </NuxtLink>
  </article>
</template>
