<script setup lang="ts">
import type { MaybeRef } from 'vue'
import { computed, toValue } from 'vue'

const props = withDefaults(
  defineProps<{
    type?: 'button' | 'submit'
    variant?: 'primary' | 'secondary' | 'ghost'
    disabled?: boolean
    /** Acepta boolean o Ref (p. ej. mutation.isPending de TanStack Query). */
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
      'bg-brand-cyan-dark text-white hover:bg-brand-cyan focus:ring-brand-cyan':
        variant === 'primary',
      'border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 focus:ring-slate-400':
        variant === 'secondary',
      'text-slate-700 hover:bg-slate-100 focus:ring-slate-400': variant === 'ghost',
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
