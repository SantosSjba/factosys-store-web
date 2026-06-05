<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    description?: string
    icon?: string
  }>(),
  { icon: 'lucide:inbox' },
)
</script>

<template>
  <div class="flex flex-col items-center px-6 py-12 text-center">
    <div
      class="bg-brand-accent-soft text-brand-accent mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
    >
      <UiIcon :name="icon" :size="28" />
    </div>
    <h3 class="text-theme text-lg font-semibold">{{ title }}</h3>
    <p v-if="description" class="text-theme-muted mt-2 max-w-md text-sm">
      {{ description }}
    </p>
    <div v-if="$slots.action" class="mt-5">
      <slot name="action" />
    </div>
  </div>
</template>
