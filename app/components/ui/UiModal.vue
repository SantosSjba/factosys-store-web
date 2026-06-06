<script setup lang="ts">
/**
 * Modal reutilizable.
 * - Encabezado: props `title` / `description` o slot `#header`
 * - Cuerpo: slot por defecto
 * - Pie: slot `#footer` (botones, acciones)
 */
const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title?: string
    description?: string
    size?: 'sm' | 'md' | 'lg' | 'xl'
    closable?: boolean
    tone?: 'admin' | 'store'
  }>(),
  {
    size: 'md',
    closable: true,
    tone: 'admin',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const slots = useSlots()

const widthClass = computed(() => {
  if (props.size === 'sm') return 'max-w-md'
  if (props.size === 'lg') return 'max-w-3xl'
  if (props.size === 'xl') return 'max-w-5xl'
  return 'max-w-xl'
})

const surfaceClass = computed(() =>
  props.tone === 'admin'
    ? 'border-admin-line bg-admin-card'
    : 'border-theme bg-theme-surface',
)

const titleClass = computed(() =>
  props.tone === 'admin' ? 'text-admin' : 'text-theme',
)

const mutedClass = computed(() =>
  props.tone === 'admin' ? 'text-admin-muted' : 'text-theme-muted',
)

const borderClass = computed(() =>
  props.tone === 'admin' ? 'border-admin-line' : 'border-theme',
)

const hasHeader = computed(
  () => Boolean(props.title || props.description || slots.header),
)

const hasFooter = computed(() => Boolean(slots.footer))

function close() {
  if (!props.closable) return
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
        v-if="closable"
        type="button"
        class="absolute inset-0 bg-slate-900/50"
        aria-label="Cerrar"
        @click="close"
      />
      <div
        v-else
        class="absolute inset-0 bg-slate-900/50"
        aria-hidden="true"
      />

      <div
        class="relative flex max-h-[calc(100dvh-2rem)] w-full flex-col overflow-hidden rounded-2xl border shadow-xl"
        :class="[widthClass, surfaceClass]"
        @click.stop
      >
        <div
          v-if="hasHeader"
          class="flex shrink-0 items-start justify-between gap-3 border-b px-5 py-4"
          :class="borderClass"
        >
          <div class="min-w-0 flex-1">
            <slot name="header">
              <h2
                v-if="title"
                class="text-lg font-semibold"
                :class="titleClass"
              >
                {{ title }}
              </h2>
              <p
                v-if="description"
                class="mt-1 text-sm"
                :class="mutedClass"
              >
                {{ description }}
              </p>
            </slot>
          </div>
          <button
            v-if="closable"
            type="button"
            class="rounded-lg p-1 transition"
            :class="[
              mutedClass,
              tone === 'admin' ? 'hover:bg-admin-surface' : 'hover:bg-theme-muted',
            ]"
            aria-label="Cerrar"
            @click="close"
          >
            <UiIcon name="lucide:x" :size="18" />
          </button>
        </div>

        <div class="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          <slot />
        </div>

        <div
          v-if="hasFooter"
          class="flex shrink-0 flex-wrap justify-end gap-2 border-t px-5 py-4"
          :class="borderClass"
        >
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>
