<script setup lang="ts">
const props = defineProps<{
  title: string
  price: number
  compareAt?: number
  imageUrl?: string
  rating?: number
  badge?: string
  to?: string
}>()

const hasLink = computed(() => Boolean(props.to && props.to !== '#'))
</script>

<template>
  <article class="border-theme bg-theme-surface group overflow-hidden rounded-xl border shadow-sm transition hover:shadow-md">
    <component
      :is="hasLink ? 'NuxtLink' : 'div'"
      :to="hasLink ? to : undefined"
      class="block"
    >
      <div class="bg-theme-muted relative aspect-square overflow-hidden">
        <StoreImage
          v-if="imageUrl"
          :src="imageUrl"
          :alt="title"
          img-class="motion-safe:transition h-full w-full motion-safe:group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
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
        <UiBadge
          v-else-if="compareAt && compareAt > price"
          variant="primary"
          class="absolute left-2 top-2 normal-case"
        >
          Oferta
        </UiBadge>
      </div>
      <div class="space-y-2 p-3 sm:p-4">
        <h3 class="text-theme line-clamp-2 text-sm font-medium leading-snug">{{ title }}</h3>
        <UiRating v-if="rating !== undefined" :value="rating" :show-value="false" />
        <UiPrice :price="price" :compare-at="compareAt" />
      </div>
    </component>
  </article>
</template>
