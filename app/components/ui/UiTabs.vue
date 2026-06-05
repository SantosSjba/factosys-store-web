<script setup lang="ts">
import type { UiTabItem } from '~/types/ui'

const props = defineProps<{
  modelValue: string
  tabs: UiTabItem[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function selectTab(id: string, disabled?: boolean) {
  if (disabled) return
  emit('update:modelValue', id)
}
</script>

<template>
  <div>
    <div
      class="border-theme flex gap-1 overflow-x-auto border-b"
      role="tablist"
    >
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        role="tab"
        class="flex shrink-0 items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition"
        :class="
          modelValue === tab.id
            ? 'border-brand-accent text-brand-accent'
            : 'text-theme-muted hover:text-theme border-transparent'
        "
        :aria-selected="modelValue === tab.id"
        :disabled="tab.disabled"
        @click="selectTab(tab.id, tab.disabled)"
      >
        <UiIcon v-if="tab.icon" :name="tab.icon" :size="16" />
        {{ tab.label }}
      </button>
    </div>
    <div class="pt-4" role="tabpanel">
      <slot :name="modelValue" />
      <slot />
    </div>
  </div>
</template>
