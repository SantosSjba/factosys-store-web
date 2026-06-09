<script setup lang="ts">
import type { SalesReportParams } from '~/types/admin-reports'
import type { UiTabItem } from '~/types/ui'
import { formatOrderStatus } from '~/utils/format-order'
import {
  downloadInventoryValuationExport,
  downloadMarginReportExport,
  downloadSalesReportExport,
  downloadTopProductsExport,
} from '~/utils/export-reports-csv'

const activeTab = ref('sales')
const tabs: UiTabItem[] = [
  { id: 'sales', label: 'Ventas', icon: 'lucide:bar-chart-3' },
  { id: 'margin', label: 'Margen', icon: 'lucide:percent' },
  { id: 'inventory', label: 'Inventario', icon: 'lucide:warehouse' },
]

const dateFrom = ref('')
const dateTo = ref('')
const isExportingSales = ref(false)
const isExportingProducts = ref(false)
const isExportingMargin = ref(false)
const isExportingInventory = ref(false)

const reportParams = computed<SalesReportParams>(() => ({
  dateFrom: dateFrom.value ? new Date(`${dateFrom.value}T00:00:00`).toISOString() : undefined,
  dateTo: dateTo.value ? new Date(`${dateTo.value}T23:59:59.999`).toISOString() : undefined,
}))

const { data: sales, isPending: salesPending } = useAdminSalesReportQuery(reportParams)
const { data: topProducts, isPending: topPending } = useAdminTopProductsQuery(reportParams)
const { data: margin, isPending: marginPending } = useAdminMarginReportQuery(reportParams)
const { data: inventory, isPending: inventoryPending } = useAdminInventoryValuationQuery()

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

async function exportMargin() {
  isExportingMargin.value = true
  try {
    await downloadMarginReportExport(reportParams.value)
  } finally {
    isExportingMargin.value = false
  }
}

async function exportInventory() {
  isExportingInventory.value = true
  try {
    await downloadInventoryValuationExport()
  } finally {
    isExportingInventory.value = false
  }
}
</script>

<template>
  <div class="space-y-4">
    <AdminCard v-if="activeTab !== 'inventory'" title="Filtros de periodo">
      <div class="flex flex-wrap items-end gap-3">
        <UiInput v-model="dateFrom" label="Desde" type="date" class="w-44" />
        <UiInput v-model="dateTo" label="Hasta" type="date" class="w-44" />
        <p v-if="sales?.range && activeTab === 'sales'" class="text-admin-muted text-sm">
          {{ formatAdminDate(sales.range.from) }} – {{ formatAdminDate(sales.range.to) }}
        </p>
        <p v-if="margin?.range && activeTab === 'margin'" class="text-admin-muted text-sm">
          {{ formatAdminDate(margin.range.from) }} – {{ formatAdminDate(margin.range.to) }}
        </p>
      </div>
    </AdminCard>

    <UiTabs v-model="activeTab" :tabs="tabs">
      <template #sales>
        <div v-if="salesPending && !sales" class="text-admin-muted flex items-center gap-2 text-sm">
          <UiSpinner size="sm" />
          Cargando reporte…
        </div>

        <div v-else-if="sales" class="space-y-4">
          <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <AdminStatCard label="Pedidos" :value="String(sales.ordersCount)" icon="orders" />
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

          <div class="grid gap-4 lg:grid-cols-2">
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
                    {{ formatPrice(item.revenue, sales.currencyCode) }}
                  </p>
                  <p class="text-admin-muted text-xs">{{ item.quantitySold }} uds.</p>
                </div>
              </div>
            </div>
          </AdminCard>
        </div>
      </template>

      <template #margin>
        <div v-if="marginPending && !margin" class="text-admin-muted flex items-center gap-2 text-sm">
          <UiSpinner size="sm" />
          Cargando margen…
        </div>
        <div v-else-if="margin" class="space-y-4">
          <div class="flex justify-end">
            <UiButton size="sm" variant="ghost" :loading="isExportingMargin" @click="exportMargin">
              <UiIcon name="lucide:download" :size="16" class="mr-2" />
              Exportar CSV
            </UiButton>
          </div>
          <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <AdminStatCard
              label="Ingresos"
              :value="formatPrice(margin.revenue, sales?.currencyCode ?? 'PEN')"
              icon="reports"
            />
            <AdminStatCard
              label="Costo"
              :value="formatPrice(margin.cost, sales?.currencyCode ?? 'PEN')"
              icon="inventory"
            />
            <AdminStatCard
              label="Margen"
              :value="formatPrice(margin.margin, sales?.currencyCode ?? 'PEN')"
              icon="coupons"
            />
            <AdminStatCard
              label="Margen %"
              :value="`${margin.marginPercent}%`"
              icon="catalog"
            />
          </div>
          <p class="text-admin-muted text-sm">
            Analizados {{ margin.itemsAnalyzed }} ítems de pedido en el periodo.
          </p>
        </div>
      </template>

      <template #inventory>
        <div
          v-if="inventoryPending && !inventory"
          class="text-admin-muted flex items-center gap-2 text-sm"
        >
          <UiSpinner size="sm" />
          Cargando inventario…
        </div>
        <div v-else-if="inventory" class="space-y-4">
          <div class="flex justify-end">
            <UiButton
              size="sm"
              variant="ghost"
              :loading="isExportingInventory"
              @click="exportInventory"
            >
              <UiIcon name="lucide:download" :size="16" class="mr-2" />
              Exportar CSV
            </UiButton>
          </div>
          <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <AdminStatCard label="Unidades" :value="String(inventory.totalUnits)" icon="inventory" />
            <AdminStatCard
              label="Valor venta"
              :value="formatPrice(inventory.totalRetailValue, inventory.currencyCode)"
              icon="reports"
            />
            <AdminStatCard
              label="Valor costo"
              :value="formatPrice(inventory.totalCostValue, inventory.currencyCode)"
              icon="catalog"
            />
            <AdminStatCard
              label="Stock bajo"
              :value="String(inventory.lowStockCount)"
              icon="orders"
            />
          </div>

          <AdminCard title="Detalle por SKU" no-padding>
            <div v-if="!inventory.items.length" class="text-admin-muted p-6 text-sm">
              Sin niveles de stock registrados.
            </div>
            <div v-else class="divide-admin-line divide-y">
              <div
                v-for="row in inventory.items"
                :key="`${row.sku}-${row.warehouseName}`"
                class="flex items-center justify-between gap-3 px-4 py-3 text-sm"
              >
                <div>
                  <p class="font-medium">{{ row.productName }}</p>
                  <p class="text-admin-muted text-xs">
                    {{ row.sku }}
                    <span v-if="row.variantName"> · {{ row.variantName }}</span>
                    · {{ row.warehouseName }}
                  </p>
                </div>
                <div class="text-right">
                  <p class="font-medium">{{ row.quantity }} uds.</p>
                  <p class="text-admin-muted text-xs">
                    {{ formatPrice(row.retailValue, inventory.currencyCode) }}
                  </p>
                </div>
              </div>
            </div>
          </AdminCard>
        </div>
      </template>
    </UiTabs>
  </div>
</template>
