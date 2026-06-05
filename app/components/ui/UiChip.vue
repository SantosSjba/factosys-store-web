<script setup lang="ts">
defineProps<{
  label: string
  removable?: boolean
}>()

const emit = defineEmits<{
  remove: []
}>()
</script>

<template>
  <span
    class="bg-theme-muted text-theme inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium"
  >
    {{ label }}
    <button
      v-if="removable"
      type="button"
      class="text-theme-muted hover:text-theme rounded-full p-0.5"
      :aria-label="`Quitar ${label}`"
      @click="emit('remove')"
    >
      <UiIcon name="lucide:x" :size="12" />
    </button>
  </span>
</template>
