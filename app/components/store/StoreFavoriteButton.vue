<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    productId: string
    size?: 'sm' | 'md' | 'lg'
    variant?: 'overlay' | 'inline'
  }>(),
  {
    size: 'md',
    variant: 'overlay',
  },
)

const { isFavorite, isPending, toggleFavorite } = useStoreFavorite(
  () => props.productId,
)

const iconName = computed(() =>
  isFavorite.value ? 'lucide:heart' : 'lucide:heart',
)

const iconClass = computed(() =>
  isFavorite.value ? 'fill-red-500 text-red-500' : 'text-theme',
)

const buttonClass = computed(() => {
  if (props.variant === 'overlay') {
    return 'bg-theme-surface/90 hover:bg-theme-surface border-theme absolute right-2 top-2 z-10 rounded-full border shadow-sm backdrop-blur-sm'
  }
  return 'border-theme bg-theme-surface hover:bg-theme-muted rounded-full border shadow-sm'
})

const sizeClass = computed(() => {
  if (props.size === 'sm') return 'p-1.5'
  if (props.size === 'lg') return 'p-3'
  return 'p-2'
})

const iconSize = computed(() => {
  if (props.size === 'sm') return 16
  if (props.size === 'lg') return 22
  return 18
})
</script>

<template>
  <button
    type="button"
    class="inline-flex items-center justify-center transition focus:outline-none focus:ring-2 focus:ring-[var(--brand-cyan)] disabled:opacity-60"
    :class="[buttonClass, sizeClass]"
    :disabled="isPending"
    :aria-label="isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'"
    :aria-pressed="isFavorite"
    @click.stop.prevent="toggleFavorite"
  >
    <UiIcon
      :name="iconName"
      :size="iconSize"
      :class="iconClass"
    />
  </button>
</template>
