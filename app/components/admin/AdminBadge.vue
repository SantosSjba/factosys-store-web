<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'soon' | 'new' | 'primary'
  }>(),
  { variant: 'soon' },
)
</script>

<template>
  <span
    class="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
    :class="{
      'bg-slate-100 text-slate-500': variant === 'soon',
      'bg-emerald-100 text-emerald-700': variant === 'new',
      'bg-[var(--admin-primary-soft)] text-[var(--admin-primary)]': variant === 'primary',
    }"
  >
    <slot />
  </span>
</template>
