<script setup lang="ts">
defineProps<{
  selected?: boolean
  title: string
  description?: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  select: []
}>()
</script>

<template>
  <button
    type="button"
    class="border-theme bg-theme-surface w-full rounded-xl border p-4 text-left transition"
    :class="[
      selected ? 'border-brand-accent ring-2 ring-[color-mix(in_srgb,var(--brand-cyan)_25%,transparent)]' : 'hover:border-brand-accent',
      disabled && 'cursor-not-allowed opacity-60',
    ]"
    :disabled="disabled"
    :aria-pressed="selected"
    @click="emit('select')"
  >
    <div class="flex items-start gap-3">
      <span
        class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border"
        :class="selected ? 'border-brand-accent bg-brand-accent text-white' : 'border-store-line'"
      >
        <UiIcon v-if="selected" name="lucide:check" :size="12" />
      </span>
      <span class="min-w-0">
        <span class="text-theme block text-sm font-semibold">{{ title }}</span>
        <span v-if="description" class="text-theme-muted mt-1 block text-xs">{{ description }}</span>
        <slot />
      </span>
    </div>
  </button>
</template>
