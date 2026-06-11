<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    width?: string
    height?: string
    rounded?: 'sm' | 'md' | 'lg' | 'full'
    tone?: 'admin' | 'store'
  }>(),
  {
    width: '100%',
    height: '1rem',
    rounded: 'md',
    tone: 'admin',
  },
)

const roundedClass = computed(() => {
  const map = {
    sm: 'rounded',
    md: 'rounded-lg',
    lg: 'rounded-xl',
    full: 'rounded-full',
  }
  return map[props.rounded]
})

const surfaceClass = computed(() =>
  props.tone === 'admin' ? 'bg-admin-surface' : 'bg-theme-muted',
)
</script>

<template>
  <div
    class="animate-pulse"
    :class="[roundedClass, surfaceClass]"
    :style="{ width: props.width, height: props.height }"
    aria-hidden="true"
  />
</template>
