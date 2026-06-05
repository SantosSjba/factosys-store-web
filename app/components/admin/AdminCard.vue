<script setup lang="ts">
defineProps<{
  title?: string
  description?: string
  noPadding?: boolean
}>()
</script>

<template>
  <UiCard tone="admin" :title="title" :description="description" :no-padding="noPadding">
    <template v-if="$slots.actions" #actions>
      <slot name="actions" />
    </template>
    <slot />
    <template v-if="$slots.footer" #footer>
      <slot name="footer" />
    </template>
  </UiCard>
</template>
