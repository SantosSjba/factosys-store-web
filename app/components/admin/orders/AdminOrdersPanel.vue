<script setup lang="ts">
import type { OrderDeliveryMethod, OrderPaymentStatus, OrderStatus, OrderSummary } from '~/types/admin-orders'
import type { UiTableColumn } from '~/types/ui'
import {
  formatDeliveryMethod,
  formatOrderStatus,
  formatPaymentStatus,
  ORDER_STATUS_OPTIONS,
  PAYMENT_STATUS_OPTIONS,
  orderStatusVariant,
  paymentStatusVariant,
} from '~/utils/format-order'
import { downloadOrdersExport } from '~/utils/export-orders-csv'

const route = useRoute()
const { can } = useAdminPermissions()

const statusFilter = ref<OrderStatus | ''>('')
const paymentFilter = ref<OrderPaymentStatus | ''>('')
const deliveryFilter = ref<OrderDeliveryMethod | ''>('')
const dateFrom = ref('')
const dateTo = ref('')
const isExporting = ref(false)

const listFilters = computed(() => ({
  status: statusFilter.value || undefined,
  paymentStatus: paymentFilter.value || undefined,
  deliveryMethod: deliveryFilter.value || undefined,
  dateFrom: dateFrom.value ? `${dateFrom.value}T00:00:00.000Z` : undefined,
  dateTo: dateTo.value ? `${dateTo.value}T23:59:59.999Z` : undefined,
}))

const {
  page,
  search,
  isPending,
  items: orders,
  paginationMeta,
} = usePaginatedAdminList<OrderSummary>(useAdminOrdersQuery, { filters: listFilters })

const createOpen = ref(false)
const detailOpen = ref(false)
const selectedOrderId = ref<string | null>(null)

const statusOptions = [
  { label: 'Todos los estados', value: '' },
  ...ORDER_STATUS_OPTIONS,
]

const paymentOptions = [
  { label: 'Todos los pagos', value: '' },
  ...PAYMENT_STATUS_OPTIONS,
]

const deliveryOptions = [
  { label: 'Toda entrega', value: '' },
  { label: 'Envío a domicilio', value: 'SHIPPING' },
  { label: 'Recojo en tienda', value: 'PICKUP' },
]

const columns: UiTableColumn<OrderSummary>[] = [
  { key: 'orderNumber', label: 'Pedido', width: '9rem' },
  { key: 'customerName', label: 'Cliente' },
  { key: 'deliveryMethod', label: 'Entrega', width: '9rem' },
  { key: 'status', label: 'Estado', width: '10rem' },
  { key: 'paymentStatus', label: 'Pago', width: '9rem' },
  { key: 'total', label: 'Total', width: '8rem' },
  { key: 'createdAt', label: 'Fecha', width: '9rem' },
]

function openDetail(order: OrderSummary) {
  selectedOrderId.value = order.id
  detailOpen.value = true
}

function onCreated(orderId: string) {
  createOpen.value = false
  selectedOrderId.value = orderId
  detailOpen.value = true
}

async function exportCsv() {
  isExporting.value = true
  try {
    await downloadOrdersExport({
      search: search.value,
      ...listFilters.value,
    })
  } finally {
    isExporting.value = false
  }
}

onMounted(() => {
  const orderId = route.query.orderId
  if (typeof orderId === 'string' && orderId) {
    selectedOrderId.value = orderId
    detailOpen.value = true
  }
})
</script>

<template>
  <div>
    <UiFilterBar title="Pedidos">
      <UiSearchInput
        v-model="search"
        placeholder="Buscar por nº pedido, cliente o correo…"
        class="min-w-[16rem] flex-1"
      />
      <UiSelect
        v-model="statusFilter"
        :options="statusOptions"
        aria-label="Filtrar por estado"
        class="w-44"
      />
      <UiSelect
        v-model="paymentFilter"
        :options="paymentOptions"
        aria-label="Filtrar por pago"
        class="w-44"
      />
      <UiSelect
        v-model="deliveryFilter"
        :options="deliveryOptions"
        aria-label="Filtrar por entrega"
        class="w-44"
      />
      <UiInput v-model="dateFrom" type="date" label="Desde" class="w-40" />
      <UiInput v-model="dateTo" type="date" label="Hasta" class="w-40" />
      <template #actions>
        <UiButton variant="ghost" :loading="isExporting" @click="exportCsv">
          <UiIcon name="lucide:download" :size="16" class="mr-2" />
          Exportar CSV
        </UiButton>
        <UiButton v-if="can('orders.write')" @click="createOpen = true">
          <UiIcon name="lucide:plus" :size="16" class="mr-2" />
          Nuevo pedido
        </UiButton>
      </template>
    </UiFilterBar>

    <AdminCard no-padding>
      <UiDataTable
        :columns="columns"
        :rows="orders"
        :loading="isPending"
        empty-title="Sin pedidos"
        empty-description="Crea el primer pedido manual o espera ventas desde la tienda."
      >
        <template #cell-orderNumber="{ row }">
          <p class="font-medium">{{ row.orderNumber }}</p>
          <p class="text-admin-muted text-xs">{{ row.itemCount }} ítem(s)</p>
        </template>
        <template #cell-customerName="{ row }">
          <p class="font-medium">{{ row.customerName || '—' }}</p>
          <p class="text-admin-muted text-xs">{{ row.customerEmail || '—' }}</p>
        </template>
        <template #cell-deliveryMethod="{ row }">
          <span class="text-sm">{{ formatDeliveryMethod(row.deliveryMethod) }}</span>
        </template>
        <template #cell-status="{ row }">
          <UiBadge :variant="orderStatusVariant(row.status)">
            {{ formatOrderStatus(row.status) }}
          </UiBadge>
        </template>
        <template #cell-paymentStatus="{ row }">
          <UiBadge :variant="paymentStatusVariant(row.paymentStatus)">
            {{ formatPaymentStatus(row.paymentStatus) }}
          </UiBadge>
        </template>
        <template #cell-total="{ row }">
          {{ formatPrice(row.total, row.currencyCode) }}
        </template>
        <template #cell-createdAt="{ row }">
          {{ formatAdminDate(row.createdAt) }}
        </template>
        <template #actions="{ row }">
          <div class="flex justify-end">
            <UiIconButton
              icon="lucide:eye"
              ariaLabel="Ver pedido"
              @click.stop="openDetail(row)"
            />
          </div>
        </template>
      </UiDataTable>

      <div
        v-if="paginationMeta && paginationMeta.total > 0"
        class="border-admin-line border-t px-4 py-3"
      >
        <UiPagination
          :page="paginationMeta.page"
          :page-size="paginationMeta.limit"
          :total="paginationMeta.total"
          tone="admin"
          @update:page="page = $event"
        />
      </div>
    </AdminCard>

    <AdminOrderCreateModal v-model="createOpen" @created="onCreated" />
    <AdminOrderDetailModal
      v-model="detailOpen"
      :order-id="selectedOrderId"
    />
  </div>
</template>
