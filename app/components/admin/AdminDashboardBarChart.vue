<script setup lang="ts">
import type { DashboardDailyPoint } from '~/types/admin-dashboard'

const props = defineProps<{
  series: DashboardDailyPoint[]
  currencyCode: string
  metric: 'orders' | 'revenue'
}>()

const maxValue = computed(() => {
  if (!props.series.length) return 1
  return Math.max(
    ...props.series.map((point) =>
      props.metric === 'orders' ? point.orders : Number(point.revenue),
    ),
    1,
  )
})

function barHeight(point: DashboardDailyPoint) {
  const value = props.metric === 'orders' ? point.orders : Number(point.revenue)
  return `${Math.max(4, (value / maxValue.value) * 100)}%`
}

function formatLabel(date: string) {
  const [, month, day] = date.split('-')
  return `${day}/${month}`
}

function formatValue(point: DashboardDailyPoint) {
  if (props.metric === 'orders') return String(point.orders)
  return formatPrice(point.revenue, props.currencyCode)
}
</script>

<template>
  <div v-if="!series.length" class="text-admin-muted text-sm">
    Sin datos en el rango seleccionado.
  </div>
  <div v-else class="flex h-44 items-end gap-1.5">
    <div
      v-for="point in series"
      :key="point.date"
      class="group flex min-w-0 flex-1 flex-col items-center gap-1"
    >
      <div class="relative flex h-36 w-full items-end justify-center">
        <div
          class="w-full max-w-8 rounded-t bg-[var(--admin-primary)]/80 transition group-hover:bg-[var(--admin-primary)]"
          :style="{ height: barHeight(point) }"
          :title="`${formatLabel(point.date)}: ${formatValue(point)}`"
        />
      </div>
      <span class="text-admin-muted truncate text-[10px]">{{ formatLabel(point.date) }}</span>
    </div>
  </div>
</template>
