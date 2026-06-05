<script setup lang="ts">
import type { UiBadgeVariant } from '~/types/ui'

withDefaults(
  defineProps<{
    variant?: UiBadgeVariant
    size?: 'sm' | 'md'
  }>(),
  { variant: 'default', size: 'sm' },
)
</script>

<template>
  <span
    class="inline-flex items-center font-semibold uppercase tracking-wide"
    :class="[
      size === 'sm' ? 'rounded-full px-2 py-0.5 text-[10px]' : 'rounded-full px-2.5 py-1 text-xs',
      {
        'bg-theme-muted text-theme-muted': variant === 'default',
        'bg-brand-accent-soft text-brand-accent': variant === 'primary',
        'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400': variant === 'success',
        'bg-amber-500/15 text-amber-600 dark:text-amber-400': variant === 'warning',
        'bg-red-500/15 text-red-600 dark:text-red-400': variant === 'danger',
        'bg-sky-500/15 text-sky-600 dark:text-sky-400': variant === 'info',
      },
    ]"
  >
    <slot />
  </span>
</template>
