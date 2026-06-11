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
  }>(),
  {
    loading: 'lazy',
    fetchpriority: 'auto',
    fit: 'cover',
    sizes: '100vw',
  },
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
    :class="imgClass"
    :style="{ objectFit: fit }"
    format="webp"
  />
  <img
    v-else
    :src="src"
    :alt="alt"
    :loading="loading"
    :fetchpriority="fetchpriority"
    :class="imgClass"
    :style="{ objectFit: fit }"
  />
</template>
