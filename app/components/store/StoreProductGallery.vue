<script setup lang="ts">
import type { CatalogProductImage } from '~/types/admin-catalog'

const props = defineProps<{
  images: CatalogProductImage[]
  productName: string
  primaryUrl?: string | null
}>()

const activeIndex = ref(0)
const lightboxOpen = ref(false)
const touchStartX = ref<number | null>(null)

const displayImages = computed(() => {
  if (props.images.length > 0) return props.images
  if (props.primaryUrl) {
    return [
      {
        id: 'primary',
        url: props.primaryUrl,
        alt: props.productName,
      } as CatalogProductImage,
    ]
  }
  return []
})

const activeImage = computed(
  () => displayImages.value[activeIndex.value] ?? null,
)

const hasMultiple = computed(() => displayImages.value.length > 1)

function selectImage(index: number) {
  if (index < 0 || index >= displayImages.value.length) return
  activeIndex.value = index
}

function showPrevious() {
  if (!hasMultiple.value) return
  selectImage(
    activeIndex.value === 0
      ? displayImages.value.length - 1
      : activeIndex.value - 1,
  )
}

function showNext() {
  if (!hasMultiple.value) return
  selectImage(
    activeIndex.value === displayImages.value.length - 1
      ? 0
      : activeIndex.value + 1,
  )
}

function onKeydown(event: KeyboardEvent) {
  if (lightboxOpen.value) {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      showPrevious()
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      showNext()
    }
    if (event.key === 'Escape') {
      lightboxOpen.value = false
    }
    return
  }

  if (event.key === 'ArrowLeft') showPrevious()
  if (event.key === 'ArrowRight') showNext()
}

function onTouchStart(event: TouchEvent) {
  touchStartX.value = event.changedTouches[0]?.clientX ?? null
}

function onTouchEnd(event: TouchEvent) {
  if (touchStartX.value === null) return

  const delta = (event.changedTouches[0]?.clientX ?? 0) - touchStartX.value
  touchStartX.value = null

  if (Math.abs(delta) < 40) return
  if (delta > 0) showPrevious()
  else showNext()
}

watch(
  () => props.images,
  () => {
    activeIndex.value = 0
  },
)

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div class="border-theme bg-theme-surface overflow-hidden rounded-xl border">
    <div
      class="flex flex-col gap-3 p-3 sm:p-4 lg:flex-row lg:gap-4"
    >
      <div
        v-if="hasMultiple"
        class="order-2 flex gap-2 overflow-x-auto pb-1 lg:order-1 lg:max-h-[min(32rem,70vh)] lg:w-20 lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden lg:pb-0"
        role="list"
        aria-label="Miniaturas del producto"
      >
        <button
          v-for="(image, index) in displayImages"
          :key="image.id"
          type="button"
          role="listitem"
          class="border-theme shrink-0 overflow-hidden rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-[var(--brand-cyan)] lg:w-full"
          :class="[
            index === activeIndex
              ? 'ring-2 ring-[var(--brand-cyan)] opacity-100'
              : 'opacity-75 hover:opacity-100',
          ]"
          :aria-label="`Ver imagen ${index + 1}`"
          :aria-current="index === activeIndex ? 'true' : undefined"
          @click="selectImage(index)"
        >
          <StoreImage
            :src="image.url"
            :alt="image.alt || `${productName} ${index + 1}`"
            img-class="aspect-square w-16 lg:w-full"
            sizes="80px"
          />
        </button>
      </div>

      <div
        class="relative order-1 min-w-0 flex-1 lg:order-2"
        @touchstart.passive="onTouchStart"
        @touchend.passive="onTouchEnd"
      >
        <button
          type="button"
          class="bg-theme-muted group/main relative block aspect-square w-full overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-cyan)]"
          :aria-label="activeImage ? `Ampliar ${productName}` : 'Sin imagen'"
          :disabled="!activeImage"
          @click="lightboxOpen = activeImage ? true : false"
        >
          <Transition
            name="gallery-fade"
            mode="out-in"
          >
            <StoreImage
              v-if="activeImage"
              :key="activeImage.id"
              :src="activeImage.url"
              :alt="activeImage.alt || productName"
              img-class="motion-safe:transition h-full w-full motion-safe:group-hover/main:scale-[1.02]"
              loading="eager"
              fetchpriority="high"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div
              v-else
              key="placeholder"
              class="text-theme-muted flex h-full items-center justify-center"
            >
              <UiIcon name="lucide:image" :size="64" />
            </div>
          </Transition>

          <span
            v-if="activeImage"
            class="bg-theme-surface/90 text-theme pointer-events-none absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium opacity-0 shadow-sm backdrop-blur-sm transition group-hover/main:opacity-100 group-focus-visible/main:opacity-100"
          >
            <UiIcon name="lucide:zoom-in" :size="14" />
            Ampliar
          </span>
        </button>

        <template v-if="hasMultiple">
          <button
            type="button"
            class="bg-theme-surface/90 border-theme hover:bg-theme-surface absolute left-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border p-2 shadow-sm backdrop-blur-sm transition sm:inline-flex"
            aria-label="Imagen anterior"
            @click.stop="showPrevious"
          >
            <UiIcon name="lucide:chevron-left" :size="20" />
          </button>
          <button
            type="button"
            class="bg-theme-surface/90 border-theme hover:bg-theme-surface absolute right-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border p-2 shadow-sm backdrop-blur-sm transition sm:inline-flex"
            aria-label="Imagen siguiente"
            @click.stop="showNext"
          >
            <UiIcon name="lucide:chevron-right" :size="20" />
          </button>
          <p
            class="bg-theme-surface/90 text-theme-muted pointer-events-none absolute bottom-3 left-3 rounded-full px-2.5 py-1 text-xs font-medium shadow-sm backdrop-blur-sm"
            aria-live="polite"
          >
            {{ activeIndex + 1 }} / {{ displayImages.length }}
          </p>
        </template>
      </div>
    </div>

    <UiModal
      v-model="lightboxOpen"
      size="full"
      tone="store"
      :title="productName"
      description="Vista ampliada del producto"
    >
      <div
        class="relative flex min-h-[50vh] items-center justify-center"
        @touchstart.passive="onTouchStart"
        @touchend.passive="onTouchEnd"
      >
        <StoreImage
          v-if="activeImage"
          :src="activeImage.url"
          :alt="activeImage.alt || productName"
          fit="contain"
          img-class="max-h-[min(75vh,48rem)] w-full"
          sizes="100vw"
        />

        <template v-if="hasMultiple">
          <button
            type="button"
            class="bg-theme-surface/90 border-theme hover:bg-theme-surface absolute left-2 top-1/2 -translate-y-1/2 rounded-full border p-2.5 shadow-sm backdrop-blur-sm"
            aria-label="Imagen anterior"
            @click="showPrevious"
          >
            <UiIcon name="lucide:chevron-left" :size="22" />
          </button>
          <button
            type="button"
            class="bg-theme-surface/90 border-theme hover:bg-theme-surface absolute right-2 top-1/2 -translate-y-1/2 rounded-full border p-2.5 shadow-sm backdrop-blur-sm"
            aria-label="Imagen siguiente"
            @click="showNext"
          >
            <UiIcon name="lucide:chevron-right" :size="22" />
          </button>
          <p class="text-theme-muted absolute bottom-2 left-1/2 -translate-x-1/2 text-sm">
            {{ activeIndex + 1 }} / {{ displayImages.length }}
          </p>
        </template>
      </div>
    </UiModal>
  </div>
</template>

<style scoped>
.gallery-fade-enter-active,
.gallery-fade-leave-active {
  transition: opacity 0.2s ease;
}

.gallery-fade-enter-from,
.gallery-fade-leave-to {
  opacity: 0;
}
</style>
