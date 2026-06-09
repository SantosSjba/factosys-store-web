<script setup lang="ts">
import type { SalesReportParams } from '~/types/admin-reports'
import { formatOrderStatus } from '~/utils/format-order'
import {
  downloadSalesReportExport,
  downloadTopProductsExport,
} from '~/utils/export-reports-csv'

const dateFrom = ref('')
const dateTo = ref('')
const isExportingSales = ref(false)
const isExportingProducts = ref(false)

const reportParams = computed<SalesReportParams>(() => ({
  dateFrom: dateFrom.value ? new Date(`${dateFrom.value}T00:00:00`).toISOString() : undefined,
  dateTo: dateTo.value ? new Date(`${dateTo.value}T23:59:59.999`).toISOString() : undefined,
}))

const { data: sales, isPending: salesPending } = useAdminSalesReportQuery(reportParams)
const { data: topProducts, isPending: topPending } = useAdminTopProductsQuery(reportParams)

async function exportSales() {
  isExportingSales.value = true
  try {
    await downloadSalesReportExport(reportParams.value)
  } finally {
    isExportingSales.value = false
  }
}

async function exportTopProducts() {
  isExportingProducts.value = true
  try {
    await downloadTopProductsExport(reportParams.value)
  } finally {
    isExportingProducts.value = false
  }
}
</script>

<template>
  <div class="space-y-4">
    <AdminCard title="Filtros de periodo">
      <div class="flex flex-wrap items-end gap-3">
        <UiInput v-model="dateFrom" label="Desde" type="date" class="w-44" />
        <UiInput v-model="dateTo" label="Hasta" type="date" class="w-44" />
        <p v-if="sales?.range" class="text-admin-muted text-sm">
          {{ formatAdminDate(sales.range.from) }} – {{ formatAdminDate(sales.range.to) }}
        </p>
      </div>
    </AdminCard>

    <div v-if="salesPending && !sales" class="text-admin-muted flex items-center gap-2 text-sm">
      <UiSpinner size="sm" />
      Cargando reporte…
    </div>

    <div v-else-if="sales" class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <AdminStatCard
        label="Pedidos"
        :value="String(sales.ordersCount)"
        icon="orders"
      />
      <AdminStatCard
        label="Ventas totales"
        :value="formatPrice(sales.revenueTotal, sales.currencyCode)"
        icon="reports"
      />
      <AdminStatCard
        label="Ticket promedio"
        :value="formatPrice(sales.averageOrderValue, sales.currencyCode)"
        icon="catalog"
      />
      <AdminStatCard
        label="Descuentos"
        :value="formatPrice(sales.discountTotal, sales.currencyCode)"
        icon="coupons"
      />
    </div>

    <div v-if="sales" class="grid gap-4 lg:grid-cols-2">
      <AdminCard title="Ventas por día">
        <div class="mb-3 flex justify-end">
          <UiButton size="sm" variant="ghost" :loading="isExportingSales" @click="exportSales">
            <UiIcon name="lucide:download" :size="16" class="mr-2" />
            Exportar CSV
          </UiButton>
        </div>
        <AdminDashboardBarChart
          :series="sales.dailySeries"
          :currency-code="sales.currencyCode"
          metric="revenue"
        />
      </AdminCard>

      <AdminCard title="Pedidos por estado">
        <div v-if="!sales.ordersByStatus.length" class="text-admin-muted text-sm">
          Sin pedidos en el periodo.
        </div>
        <div v-else class="space-y-2">
          <div
            v-for="row in sales.ordersByStatus"
            :key="row.status"
            class="flex items-center justify-between text-sm"
          >
            <span>{{ formatOrderStatus(row.status) }}</span>
            <UiBadge variant="default">{{ row.count }}</UiBadge>
          </div>
        </div>
      </AdminCard>
    </div>

    <AdminCard title="Top productos" no-padding>
      <div class="flex items-center justify-between border-b px-4 py-3">
        <p class="text-admin-muted text-sm">Por ventas pagadas en el periodo</p>
        <UiButton
          size="sm"
          variant="ghost"
          :loading="isExportingProducts"
          @click="exportTopProducts"
        >
          <UiIcon name="lucide:download" :size="16" class="mr-2" />
          Exportar CSV
        </UiButton>
      </div>
      <div v-if="topPending && !topProducts" class="text-admin-muted p-4 text-sm">
        Cargando productos…
      </div>
      <div v-else-if="!topProducts?.items.length" class="text-admin-muted p-6 text-sm">
        Sin ventas de productos en el periodo seleccionado.
      </div>
      <div v-else class="divide-admin-line divide-y">
        <div
          v-for="item in topProducts.items"
          :key="item.productId"
          class="flex items-center justify-between gap-3 px-4 py-3 text-sm"
        >
          <div class="flex items-center gap-3">
            <span class="text-admin-muted w-6 font-mono">{{ item.rank }}</span>
            <div>
              <p class="font-medium">{{ item.productName }}</p>
              <p class="text-admin-muted text-xs">{{ item.sku }}</p>
            </div>
          </div>
          <div class="text-right">
            <p class="font-medium">
              {{ formatPrice(item.revenue, sales?.currencyCode ?? 'PEN') }}
            </p>
            <p class="text-admin-muted text-xs">{{ item.quantitySold }} uds.</p>
          </div>
        </div>
      </div>
    </AdminCard>
  </div>
</template>
