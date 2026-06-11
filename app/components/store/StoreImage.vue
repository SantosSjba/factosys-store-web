<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    src: string
    alt: string
    loading?: 'lazy' | 'eager'
    fetchpriority?: 'high' | 'low' | 'auto'
    fit?: 'cover' | 'contain'
    sizes?: string
    imgClass?: string
    /** Evita que el navegador capture el clic para arrastrar la imagen (común en Windows). */
    clickThrough?: boolean
  }>(),
  {
    loading: 'lazy',
    fetchpriority: 'auto',
    fit: 'cover',
    sizes: '100vw',
    clickThrough: false,
  },
)

const mergedImgClass = computed(() =>
  [props.imgClass, props.clickThrough && 'pointer-events-none select-none']
    .filter(Boolean)
    .join(' '),
)

/** IPX solo para assets estáticos locales; /api/media/* va al backend vía proxy. */
const shouldOptimize = computed(() => {
  if (!props.src.startsWith('/')) return false
  if (props.src.startsWith('/api/')) return false
  return true
})
</script>

<template>
  <NuxtImg
    v-if="shouldOptimize"
    :src="src"
    :alt="alt"
    :loading="loading"
    :fetchpriority="fetchpriority"
    :sizes="sizes"
    :class="mergedImgClass"
    :style="{ objectFit: fit }"
    draggable="false"
    format="webp"
  />
  <img
    v-else
    :src="src"
    :alt="alt"
    :loading="loading"
    :fetchpriority="fetchpriority"
    :class="mergedImgClass"
    :style="{ objectFit: fit }"
    draggable="false"
  />
</template>
