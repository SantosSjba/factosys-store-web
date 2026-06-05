<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    size?: 'sm' | 'md' | 'lg'
  }>(),
  { size: 'md' },
)

const sizeClass = computed(() => {
  if (props.size === 'sm') return 'h-4 w-4 border-2'
  if (props.size === 'lg') return 'h-8 w-8 border-[3px]'
  return 'h-5 w-5 border-2'
})
</script>

<template>
  <span
    class="border-brand-accent inline-block animate-spin rounded-full border-r-transparent"
    :class="sizeClass"
    role="status"
    aria-label="Cargando"
  />
</template>
