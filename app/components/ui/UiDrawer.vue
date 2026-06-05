<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title?: string
    side?: 'left' | 'right'
    width?: string
  }>(),
  { side: 'right', width: 'min(24rem, 90vw)' },
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

function close() {
  emit('update:modelValue', false)
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-[10001]"
      role="dialog"
      aria-modal="true"
      :aria-label="title || 'Panel lateral'"
    >
      <button
        type="button"
        class="absolute inset-0 bg-slate-900/50"
        aria-label="Cerrar"
        @click="close"
      />
      <aside
        class="bg-theme-surface border-theme absolute top-0 flex h-full flex-col border shadow-xl"
        :class="side === 'left' ? 'left-0' : 'right-0'"
        :style="{ width: props.width }"
        @click.stop
      >
        <div
          v-if="title || $slots.header"
          class="border-theme flex items-center justify-between gap-3 border-b px-4 py-4"
        >
          <h2 v-if="title" class="text-theme text-base font-semibold">{{ title }}</h2>
          <slot name="header" />
          <button
            type="button"
            class="text-theme-muted ml-auto rounded-lg p-1 hover:bg-theme-muted"
            aria-label="Cerrar"
            @click="close"
          >
            <UiIcon name="lucide:x" :size="18" />
          </button>
        </div>
        <div class="flex-1 overflow-y-auto p-4">
          <slot />
        </div>
        <div v-if="$slots.footer" class="border-theme border-t p-4">
          <slot name="footer" />
        </div>
      </aside>
    </div>
  </Teleport>
</template>
