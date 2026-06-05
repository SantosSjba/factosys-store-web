<script setup lang="ts">
withDefaults(
  defineProps<{
    label?: string
  }>(),
  {},
)
</script>

<template>
  <div class="relative my-4">
    <div class="border-theme absolute inset-0 flex items-center" aria-hidden="true">
      <div class="w-full border-t" />
    </div>
    <div v-if="label" class="relative flex justify-center">
      <span class="bg-theme-surface text-theme-muted px-3 text-xs uppercase tracking-wide">
        {{ label }}
      </span>
    </div>
  </div>
</template>
