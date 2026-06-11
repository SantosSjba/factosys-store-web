<script setup lang="ts">
import type { StoreBanner } from '~/types/store'

const props = defineProps<{
  banners: StoreBanner[]
  loading?: boolean
  storeName?: string
  storeTagline?: string | null
}>()

const activeIndex = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

const prefersReducedMotion = usePreferredReducedMotion()

const visibleBanners = computed(() =>
  props.banners.filter((banner) => Boolean(banner.imageUrl)),
)

function goTo(index: number) {
  if (visibleBanners.value.length === 0) return
  activeIndex.value =
    ((index % visibleBanners.value.length) + visibleBanners.value.length) %
    visibleBanners.value.length
}

function next() {
  goTo(activeIndex.value + 1)
}

function startAutoplay() {
  stopAutoplay()
  if (visibleBanners.value.length <= 1) return
  if (prefersReducedMotion.value === 'reduce') return
  timer = setInterval(next, 6000)
}

function stopAutoplay() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

function isExternal(url: string) {
  return url.startsWith('http://') || url.startsWith('https://')
}

watch(
  () => visibleBanners.value.length,
  () => {
    activeIndex.value = 0
    startAutoplay()
  },
  { immediate: true },
)

onUnmounted(stopAutoplay)
</script>

<template>
  <section
    class="relative overflow-hidden"
    aria-roledescription="carousel"
    :aria-label="`Banners de ${storeName || 'la tienda'}`"
  >
    <div
      v-if="loading"
      class="bg-theme-muted aspect-[21/9] min-h-[11rem] animate-pulse sm:aspect-[21/8] sm:min-h-[14rem] lg:min-h-[18rem]"
    />

    <div
      v-else-if="visibleBanners.length === 0"
      class="from-brand-accent/20 to-brand-accent-deep/30 flex aspect-[21/9] min-h-[11rem] items-center justify-center bg-gradient-to-r sm:aspect-[21/8] sm:min-h-[14rem] lg:min-h-[18rem]"
    >
      <div class="px-6 text-center">
        <p class="text-theme text-xl font-bold sm:text-2xl lg:text-3xl">
          Bienvenido a {{ storeName || 'Factosys Store' }}
        </p>
        <p class="text-theme-muted mt-2 text-sm sm:text-base">
          {{ storeTagline || 'Tecnología y más, con envíos a todo el Perú' }}
        </p>
      </div>
    </div>

    <div
      v-else
      class="relative aspect-[21/9] min-h-[11rem] sm:aspect-[21/8] sm:min-h-[14rem] lg:min-h-[18rem]"
      @mouseenter="stopAutoplay"
      @mouseleave="startAutoplay"
      @focusin="stopAutoplay"
      @focusout="startAutoplay"
    >
      <article
        v-for="(banner, index) in visibleBanners"
        :key="banner.id"
        class="absolute inset-0 motion-safe:transition-opacity motion-safe:duration-500"
        :class="index === activeIndex ? 'opacity-100' : 'pointer-events-none opacity-0'"
        role="group"
        :aria-roledescription="`slide ${index + 1} de ${visibleBanners.length}`"
        :aria-hidden="index !== activeIndex"
      >
        <component
          :is="banner.linkUrl ? 'a' : 'div'"
          :href="banner.linkUrl || undefined"
          :rel="banner.linkUrl && isExternal(banner.linkUrl) ? 'noopener noreferrer' : undefined"
          class="block h-full w-full"
        >
          <StoreImage
            :src="banner.imageUrl!"
            :alt="banner.title"
            img-class="h-full w-full"
            :loading="index === 0 ? 'eager' : 'lazy'"
            :fetchpriority="index === 0 ? 'high' : 'auto'"
            sizes="100vw"
          />
          <div
            v-if="banner.title || banner.subtitle"
            class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent px-4 py-6 sm:px-6 sm:py-8"
          >
            <h2 v-if="banner.title" class="text-lg font-bold text-white sm:text-2xl">
              {{ banner.title }}
            </h2>
            <p v-if="banner.subtitle" class="mt-1 text-xs text-white/90 sm:text-base">
              {{ banner.subtitle }}
            </p>
          </div>
        </component>
      </article>

      <button
        v-if="visibleBanners.length > 1"
        type="button"
        class="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 sm:left-3 sm:h-11 sm:w-11"
        aria-label="Banner anterior"
        @click="goTo(activeIndex - 1)"
      >
        <UiIcon name="lucide:chevron-left" :size="20" />
      </button>
      <button
        v-if="visibleBanners.length > 1"
        type="button"
        class="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 sm:right-3 sm:h-11 sm:w-11"
        aria-label="Banner siguiente"
        @click="next"
      >
        <UiIcon name="lucide:chevron-right" :size="20" />
      </button>

      <div
        v-if="visibleBanners.length > 1"
        class="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2"
        role="tablist"
        aria-label="Seleccionar banner"
      >
        <button
          v-for="(banner, index) in visibleBanners"
          :key="`dot-${banner.id}`"
          type="button"
          role="tab"
          class="flex h-10 w-10 items-center justify-center"
          :aria-label="`Ir al banner ${index + 1}`"
          :aria-selected="index === activeIndex"
          @click="goTo(index)"
        >
          <span
            class="block h-2.5 w-2.5 rounded-full transition"
            :class="index === activeIndex ? 'bg-white' : 'bg-white/50'"
          />
        </button>
      </div>
    </div>
  </section>
</template>
