<script setup lang="ts">
import type { CatalogProductImage } from '~/types/admin-catalog'

const props = defineProps<{
  images: CatalogProductImage[]
  productName: string
  primaryUrl?: string | null
}>()

const activeIndex = ref(0)

const displayImages = computed(() => {
  if (props.images.length > 0) return props.images
  if (props.primaryUrl) {
    return [{ id: 'primary', url: props.primaryUrl, alt: props.productName }] as CatalogProductImage[]
  }
  return []
})

const activeImage = computed(
  () => displayImages.value[activeIndex.value] ?? null,
)

watch(
  () => props.images,
  () => {
    activeIndex.value = 0
  },
)
</script>

<template>
  <div class="border-theme bg-theme-surface overflow-hidden rounded-xl border">
    <div class="bg-theme-muted relative aspect-square">
      <StoreImage
        v-if="activeImage"
        :src="activeImage.url"
        :alt="activeImage.alt || productName"
        img-class="h-full w-full"
        loading="eager"
        fetchpriority="high"
        sizes="(max-width: 1024px) 100vw, 50vw"
      />
      <div
        v-else
        class="text-theme-muted flex h-full items-center justify-center"
      >
        <UiIcon name="lucide:image" :size="64" />
      </div>
    </div>

    <div
      v-if="displayImages.length > 1"
      class="grid grid-cols-3 gap-2 p-3 sm:grid-cols-4"
      role="list"
      aria-label="Miniaturas del producto"
    >
      <button
        v-for="(image, index) in displayImages"
        :key="image.id"
        type="button"
        role="listitem"
        class="border-theme overflow-hidden rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-[var(--brand-cyan)]"
        :class="index === activeIndex ? 'ring-2 ring-[var(--brand-cyan)]' : 'opacity-80 hover:opacity-100'"
        :aria-label="`Ver imagen ${index + 1}`"
        :aria-current="index === activeIndex ? 'true' : undefined"
        @click="activeIndex = index"
      >
        <StoreImage
          :src="image.url"
          :alt="image.alt || `${productName} ${index + 1}`"
          img-class="aspect-square w-full"
          sizes="80px"
        />
      </button>
    </div>
  </div>
</template>
