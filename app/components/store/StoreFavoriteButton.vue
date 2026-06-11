<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    productId: string
    size?: 'sm' | 'md' | 'lg'
    variant?: 'overlay' | 'inline'
    showLabel?: boolean
  }>(),
  {
    size: 'md',
    variant: 'overlay',
    showLabel: false,
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
  if (props.showLabel) {
    return 'border-theme bg-theme-surface hover:bg-theme-muted rounded-lg border px-4 py-2.5 text-sm font-semibold shadow-sm'
  }
  return 'border-theme bg-theme-surface hover:bg-theme-muted rounded-full border shadow-sm'
})

const labelText = computed(() =>
  isFavorite.value ? 'En favoritos' : 'Agregar a favoritos',
)

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
    :class="[buttonClass, sizeClass, showLabel && 'gap-2']"
    :disabled="isPending"
    :aria-label="showLabel ? undefined : isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'"
    :aria-pressed="isFavorite"
    @click.stop="toggleFavorite"
  >
    <UiIcon
      :name="iconName"
      :size="iconSize"
      :class="iconClass"
    />
    <span v-if="showLabel" class="text-theme">{{ labelText }}</span>
  </button>
</template>
