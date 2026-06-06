<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    page: number
    pageSize: number
    total: number
    tone?: 'admin' | 'store'
  }>(),
  { tone: 'admin' },
)

const emit = defineEmits<{
  'update:page': [value: number]
}>()

const totalPages = computed(() =>
  Math.max(1, Math.ceil(props.total / props.pageSize)),
)

const from = computed(() =>
  props.total === 0 ? 0 : (props.page - 1) * props.pageSize + 1,
)

const to = computed(() =>
  Math.min(props.page * props.pageSize, props.total),
)

const surfaceClass = computed(() =>
  props.tone === 'admin'
    ? 'border-admin-line bg-admin-card'
    : 'border-theme bg-theme-surface',
)

const textMutedClass = computed(() =>
  props.tone === 'admin' ? 'text-admin-muted' : 'text-theme-muted',
)

const textClass = computed(() =>
  props.tone === 'admin' ? 'text-admin' : 'text-theme',
)

function goTo(page: number) {
  const next = Math.min(Math.max(1, page), totalPages.value)
  emit('update:page', next)
}
</script>

<template>
  <div
    class="flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3"
    :class="surfaceClass"
  >
    <p class="text-sm" :class="textMutedClass">
      Mostrando
      <span class="font-medium" :class="textClass">{{ from }}-{{ to }}</span>
      de
      <span class="font-medium" :class="textClass">{{ total }}</span>
    </p>
    <div class="flex items-center gap-1">
      <UiIconButton
        icon="lucide:chevron-left"
        ariaLabel="Página anterior"
        :disabled="page <= 1"
        @click="goTo(page - 1)"
      />
      <span class="min-w-[4rem] text-center text-sm font-medium" :class="textClass">
        {{ page }} / {{ totalPages }}
      </span>
      <UiIconButton
        icon="lucide:chevron-right"
        ariaLabel="Página siguiente"
        :disabled="page >= totalPages"
        @click="goTo(page + 1)"
      />
    </div>
  </div>
</template>
