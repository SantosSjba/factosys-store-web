<script setup lang="ts">
import type { MaybeRef } from 'vue'
import { computed, toValue } from 'vue'

const props = withDefaults(
  defineProps<{
    type?: 'button' | 'submit'
    variant?: 'primary' | 'secondary' | 'ghost'
    disabled?: boolean
    loading?: MaybeRef<boolean>
  }>(),
  {
    type: 'button',
    variant: 'primary',
    disabled: false,
    loading: false,
  },
)

const isLoading = computed(() => toValue(props.loading))
</script>

<template>
  <button
    :type="type"
    class="inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
    :class="{
      'bg-brand-accent text-white hover:opacity-90 focus:ring-[var(--brand-cyan)]':
        variant === 'primary',
      'border-theme bg-theme-surface text-theme hover:bg-theme-muted border focus:ring-[var(--brand-cyan)]':
        variant === 'secondary',
      'text-theme hover:bg-theme-muted focus:ring-[var(--brand-cyan)]': variant === 'ghost',
    }"
    :disabled="disabled || isLoading"
  >
    <span
      v-if="isLoading"
      class="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
    />
    <slot />
  </button>
</template>
