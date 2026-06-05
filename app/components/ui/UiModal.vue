<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title?: string
    description?: string
    size?: 'sm' | 'md' | 'lg'
  }>(),
  { size: 'md' },
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const widthClass = computed(() => {
  if (props.size === 'sm') return 'max-w-md'
  if (props.size === 'lg') return 'max-w-3xl'
  return 'max-w-xl'
})

function close() {
  emit('update:modelValue', false)
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-[10001] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      :aria-label="title || 'Diálogo'"
    >
      <button
        type="button"
        class="absolute inset-0 bg-slate-900/50"
        aria-label="Cerrar"
        @click="close"
      />
      <div
        class="border-admin-line bg-admin-card relative w-full rounded-2xl border shadow-xl"
        :class="widthClass"
        @click.stop
      >
        <div
          v-if="title || $slots.header"
          class="border-admin-line flex items-start justify-between gap-3 border-b px-5 py-4"
        >
          <div>
            <h2 v-if="title" class="text-admin text-lg font-semibold">{{ title }}</h2>
            <p v-if="description" class="text-admin-muted mt-1 text-sm">{{ description }}</p>
            <slot name="header" />
          </div>
          <button
            type="button"
            class="text-admin-muted rounded-lg p-1 transition hover:bg-admin-surface"
            aria-label="Cerrar"
            @click="close"
          >
            <UiIcon name="lucide:x" :size="18" />
          </button>
        </div>
        <div class="px-5 py-4">
          <slot />
        </div>
        <div
          v-if="$slots.footer"
          class="border-admin-line flex flex-wrap justify-end gap-2 border-t px-5 py-4"
        >
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>
