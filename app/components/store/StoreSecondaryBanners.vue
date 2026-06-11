<script setup lang="ts">
import type { StoreBanner } from '~/types/store'

defineProps<{
  banners: StoreBanner[]
  loading?: boolean
}>()

function isExternal(url: string) {
  return url.startsWith('http://') || url.startsWith('https://')
}
</script>

<template>
  <section
    v-if="loading || banners.length > 0"
    class="mx-auto max-w-7xl px-4 py-6 sm:py-8"
  >
    <div
      v-if="loading"
      class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      <UiSkeleton
        v-for="index in 3"
        :key="index"
        tone="store"
        height="10rem"
        rounded="lg"
      />
    </div>

    <div
      v-else
      class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      <article
        v-for="banner in banners"
        :key="banner.id"
        class="border-theme group overflow-hidden rounded-xl border shadow-sm transition hover:shadow-md"
      >
        <component
          :is="banner.linkUrl ? 'a' : 'div'"
          :href="banner.linkUrl || undefined"
          :rel="banner.linkUrl && isExternal(banner.linkUrl) ? 'noopener noreferrer' : undefined"
          class="block"
        >
          <div class="bg-theme-muted relative aspect-[16/7] overflow-hidden sm:aspect-[16/6]">
            <StoreImage
              v-if="banner.imageUrl"
              :src="banner.imageUrl"
              :alt="banner.title"
              img-class="motion-safe:transition h-full w-full motion-safe:group-hover:scale-[1.02]"
              sizes="(max-width: 640px) 100vw, 33vw"
            />
            <div
              v-if="banner.title || banner.subtitle"
              class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3 text-white"
            >
              <h3 v-if="banner.title" class="text-sm font-semibold sm:text-base">
                {{ banner.title }}
              </h3>
              <p v-if="banner.subtitle" class="mt-0.5 text-xs text-white/90 sm:text-sm">
                {{ banner.subtitle }}
              </p>
            </div>
          </div>
        </component>
      </article>
    </div>
  </section>
</template>
