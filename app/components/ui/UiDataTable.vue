<script setup lang="ts" generic="T extends Record<string, unknown>">
import type { UiTableColumn } from '~/types/ui'

const props = withDefaults(
  defineProps<{
    columns: UiTableColumn<T>[]
    rows: T[]
    loading?: boolean
    emptyTitle?: string
    emptyDescription?: string
    rowKey?: keyof T & string
  }>(),
  {
    loading: false,
    emptyTitle: 'Sin registros',
    emptyDescription: 'No hay datos para mostrar en este momento.',
    rowKey: 'id' as keyof T & string,
  },
)

function getRowKey(row: T, index: number): string {
  const key = (props.rowKey ?? 'id') as keyof T
  const value = row[key]
  return value == null ? String(index) : String(value)
}
</script>

<template>
  <div class="border-theme bg-theme-surface overflow-hidden rounded-xl border shadow-sm">
    <div v-if="loading" class="space-y-3 p-4">
      <UiSkeleton v-for="i in 5" :key="i" height="2.5rem" />
    </div>

    <div v-else-if="!rows.length" class="p-2">
      <UiEmptyState :title="emptyTitle" :description="emptyDescription" />
    </div>

    <div v-else class="overflow-x-auto">
      <table class="w-full min-w-[40rem] text-left text-sm">
        <thead class="border-theme bg-theme-muted border-b">
          <tr>
            <th
              v-for="col in columns"
              :key="col.key"
              class="text-theme-muted px-4 py-3 text-xs font-semibold uppercase tracking-wide"
              :class="{
                'text-center': col.align === 'center',
                'text-right': col.align === 'right',
              }"
              :style="col.width ? { width: col.width } : undefined"
            >
              {{ col.label }}
            </th>
            <th v-if="$slots.actions" class="px-4 py-3 text-right text-xs font-semibold uppercase">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, index) in rows"
            :key="getRowKey(row, index)"
            class="border-theme hover:bg-theme-muted border-b transition last:border-b-0"
          >
            <td
              v-for="col in columns"
              :key="col.key"
              class="text-theme px-4 py-3"
              :class="{
                'text-center': col.align === 'center',
                'text-right': col.align === 'right',
              }"
            >
              <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]">
                {{ row[col.key] }}
              </slot>
            </td>
            <td v-if="$slots.actions" class="px-4 py-3 text-right">
              <slot name="actions" :row="row" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
