<script setup lang="ts">
import type { UiBadgeVariant } from '~/types/ui'

const variantMap: Record<'soon' | 'new' | 'primary', UiBadgeVariant> = {
  soon: 'default',
  new: 'success',
  primary: 'primary',
}

const props = withDefaults(
  defineProps<{
    variant?: 'soon' | 'new' | 'primary'
  }>(),
  { variant: 'soon' },
)
</script>

<template>
  <UiBadge :variant="variantMap[variant]">
    <slot />
  </UiBadge>
</template>
