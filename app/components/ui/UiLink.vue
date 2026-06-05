<script setup lang="ts">
withDefaults(
  defineProps<{
    to?: string
    href?: string
    external?: boolean
    variant?: 'default' | 'muted'
  }>(),
  { variant: 'default' },
)
</script>

<template>
  <NuxtLink
    v-if="to"
    :to="to"
    class="font-medium transition hover:underline"
    :class="variant === 'muted' ? 'text-theme-muted hover:text-theme' : 'text-brand-accent'"
  >
    <slot />
  </NuxtLink>
  <a
    v-else
    :href="href"
    class="font-medium transition hover:underline"
    :class="variant === 'muted' ? 'text-theme-muted hover:text-theme' : 'text-brand-accent'"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noopener noreferrer' : undefined"
  >
    <slot />
  </a>
</template>
