<script setup lang="ts">
import { Icon } from '@iconify/vue'

const props = withDefaults(
  defineProps<{
    name: string
    size?: number | string
  }>(),
  { size: 20 },
)

const dimension = computed(() =>
  typeof props.size === 'number' ? `${props.size}px` : props.size,
)
</script>

<template>
  <Icon
    :icon="name"
    :width="dimension"
    :height="dimension"
    class="inline-block shrink-0"
    aria-hidden="true"
  />
</template>
