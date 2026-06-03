<script setup lang="ts">
withDefaults(
  defineProps<{
    type?: 'button' | 'submit'
    variant?: 'primary' | 'secondary' | 'ghost'
    disabled?: boolean
    loading?: boolean
  }>(),
  {
    type: 'button',
    variant: 'primary',
    disabled: false,
    loading: false,
  },
)
</script>

<template>
  <button
    :type="type"
    class="inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
    :class="{
      'bg-indigo-600 text-white hover:bg-indigo-500 focus:ring-indigo-500':
        variant === 'primary',
      'border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 focus:ring-slate-400':
        variant === 'secondary',
      'text-slate-700 hover:bg-slate-100 focus:ring-slate-400': variant === 'ghost',
    }"
    :disabled="disabled || loading"
  >
    <span
      v-if="loading"
      class="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
    />
    <slot />
  </button>
</template>
