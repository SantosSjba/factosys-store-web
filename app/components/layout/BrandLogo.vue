<script setup lang="ts">
withDefaults(
  defineProps<{
    to?: string
    size?: 'sm' | 'md'
  }>(),
  { to: '/', size: 'md' },
)

const textSize = computed(() =>
  size === 'sm' ? 'text-base sm:text-lg' : 'text-lg sm:text-xl',
)

const storeSize = computed(() =>
  size === 'sm' ? 'text-xs sm:text-sm' : 'text-sm sm:text-base',
)
</script>

<template>
  <NuxtLink
    :to="to"
    class="flex shrink-0 items-baseline font-bold tracking-tight"
  >
    <span :class="textSize">
      <span class="text-brand-facto">FACTO</span><span class="text-brand-sys">SYS</span>
    </span>
    <span class="text-theme-muted ml-1.5 font-medium" :class="storeSize">Store</span>
  </NuxtLink>
</template>
