<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    width?: string
    height?: string
    rounded?: 'sm' | 'md' | 'lg' | 'full'
  }>(),
  {
    width: '100%',
    height: '1rem',
    rounded: 'md',
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
</script>

<template>
  <div
    class="bg-admin-surface animate-pulse"
    :class="roundedClass"
    :style="{ width: props.width, height: props.height }"
    aria-hidden="true"
  />
</template>
