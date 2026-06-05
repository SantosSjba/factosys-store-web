<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'error' | 'success' | 'info' | 'warning'
  }>(),
  { variant: 'info' },
)

const iconByVariant = {
  error: 'lucide:circle-x',
  success: 'lucide:circle-check',
  info: 'lucide:info',
  warning: 'lucide:triangle-alert',
} as const
</script>

<template>
  <div
    class="flex items-start gap-3 rounded-lg border px-4 py-3 text-sm"
    :class="{
      'border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300': variant === 'error',
      'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300':
        variant === 'success',
      'border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300': variant === 'info',
      'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300':
        variant === 'warning',
    }"
    role="alert"
  >
    <UiIcon :name="iconByVariant[variant]" :size="18" class="mt-0.5 shrink-0" />
    <div class="flex-1"><slot /></div>
  </div>
</template>
