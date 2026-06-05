<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    name?: string
    src?: string
    size?: 'sm' | 'md' | 'lg'
  }>(),
  { size: 'md' },
)

const sizeClass = computed(() => {
  if (props.size === 'sm') return 'h-8 w-8 text-xs'
  if (props.size === 'lg') return 'h-12 w-12 text-base'
  return 'h-10 w-10 text-sm'
})

const initials = computed(() => {
  if (!props.name) return '?'
  return props.name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
})
</script>

<template>
  <span
    class="bg-brand-accent inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-semibold text-white"
    :class="sizeClass"
  >
    <img v-if="src" :src="src" :alt="name || 'Avatar'" class="h-full w-full object-cover" />
    <span v-else>{{ initials }}</span>
  </span>
</template>
