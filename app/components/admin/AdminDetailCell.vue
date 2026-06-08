<script setup lang="ts">
defineOptions({ inheritAttrs: false })

defineProps<{
  label: string
}>()
</script>

<template>
  <div class="bg-admin-surface rounded-xl p-4" v-bind="$attrs">
    <p class="text-admin-muted text-xs font-medium uppercase">{{ label }}</p>
    <div class="text-admin mt-1">
      <slot />
    </div>
  </div>
</template>
