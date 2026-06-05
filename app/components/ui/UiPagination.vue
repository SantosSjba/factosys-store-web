<script setup lang="ts">
const props = defineProps<{
  page: number
  pageSize: number
  total: number
}>()

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

function goTo(page: number) {
  const next = Math.min(Math.max(1, page), totalPages.value)
  emit('update:page', next)
}
</script>

<template>
  <div
    class="border-admin-line bg-admin-card flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3"
  >
    <p class="text-admin-muted text-sm">
      Mostrando <span class="text-admin font-medium">{{ from }}-{{ to }}</span>
      de <span class="text-admin font-medium">{{ total }}</span>
    </p>
    <div class="flex items-center gap-1">
      <UiIconButton
        icon="lucide:chevron-left"
        ariaLabel="Página anterior"
        :disabled="page <= 1"
        @click="goTo(page - 1)"
      />
      <span class="text-admin min-w-[4rem] text-center text-sm font-medium">
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
