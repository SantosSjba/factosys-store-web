<script setup lang="ts">
import { lookupAdminOrders } from '~/api/admin-orders.api'
import type {
  ReturnRequestReason,
  ReturnRequestStatus,
  ReturnRequestSummary,
} from '~/types/admin-returns'
import type { OrderItem, OrderSummary } from '~/types/admin-orders'
import type { UiTableColumn } from '~/types/ui'
import { formatOrderStatus, orderStatusVariant } from '~/utils/format-order'
import {
  formatReturnReason,
  formatReturnStatus,
  RETURN_REASON_OPTIONS,
  RETURN_STATUS_OPTIONS,
  returnStatusVariant,
} from '~/utils/format-return'

const { can } = useAdminPermissions()
const createMutation = useAdminCreateReturnMutation()
const statusMutation = useAdminUpdateReturnStatusMutation()

const page = ref(1)
const search = ref('')
const filterStatus = ref('')

const queryParams = computed(() => ({
  page: page.value,
  limit: 10,
  search: search.value.trim() || undefined,
  status: (filterStatus.value || undefined) as ReturnRequestStatus | undefined,
}))

const { data, isPending, refetch } = useAdminReturnsQuery(queryParams)

const returns = computed(() => data.value?.items ?? [])
const paginationMeta = computed(() => data.value?.meta)

watch([search, filterStatus], () => {
  page.value = 1
})

const createOpen = ref(false)
const detailOpen = ref(false)
const selectedReturn = ref<ReturnRequestSummary | null>(null)

const orderId = ref('')
const selectedOrderSummary = ref<OrderSummary | null>(null)
const orderSearch = ref('')
const orderResults = ref<OrderSummary[]>([])
const isOrderSearching = ref(false)
const reason = ref<ReturnRequestReason>('DEFECTIVE')
const reasonNote = ref('')
const internalNotes = ref('')
const restockItems = ref(true)
const formError = ref('')
const selectedItems = ref<Record<string, number>>({})

const orderIdRef = computed(() => (createOpen.value ? orderId.value.trim() || null : null))
const { data: orderForReturn, isFetching: orderLoading } = useAdminOrderQuery(orderIdRef)

let orderSearchTimer: ReturnType<typeof setTimeout> | undefined

function formatOrderLabel(order: OrderSummary) {
  const customer = order.customerName || order.customerEmail || 'Sin cliente'
  return `${order.orderNumber} · ${customer}`
}

function scheduleOrderSearch() {
  clearTimeout(orderSearchTimer)
  if (orderSearch.value.trim().length < 2) {
    orderResults.value = []
    isOrderSearching.value = false
    return
  }
  orderSearchTimer = setTimeout(async () => {
    isOrderSearching.value = true
    try {
      orderResults.value = await lookupAdminOrders(orderSearch.value, { status: 'DELIVERED' })
    } catch {
      orderResults.value = []
    } finally {
      isOrderSearching.value = false
    }
  }, 300)
}

function selectOrder(order: OrderSummary) {
  orderId.value = order.id
  selectedOrderSummary.value = order
  orderSearch.value = ''
  orderResults.value = []
}

function clearOrderSelection() {
  orderId.value = ''
  selectedOrderSummary.value = null
  orderSearch.value = ''
  orderResults.value = []
  isOrderSearching.value = false
}

watch(createOpen, (open) => {
  if (!open) {
    clearTimeout(orderSearchTimer)
    orderId.value = ''
    selectedOrderSummary.value = null
    orderSearch.value = ''
    orderResults.value = []
    isOrderSearching.value = false
    selectedItems.value = {}
    formError.value = ''
  }
})

watch(orderForReturn, (order) => {
  if (!order) {
    selectedItems.value = {}
    return
  }
  const next: Record<string, number> = {}
  for (const item of order.items) {
    next[item.id] = 0
  }
  selectedItems.value = next
})

function setItemQuantity(itemId: string, quantity: number) {
  selectedItems.value = { ...selectedItems.value, [itemId]: quantity }
}

function isItemSelected(itemId: string) {
  return (selectedItems.value[itemId] ?? 0) > 0
}

function toggleItem(item: OrderItem, checked: boolean) {
  setItemQuantity(item.id, checked ? item.quantity : 0)
}

function onItemQuantityInput(item: OrderItem, value: string | number) {
  const quantity = Math.min(Math.max(Number(value) || 0, 0), item.quantity)
  setItemQuantity(item.id, quantity)
}

const selectedItemsTotal = computed(() => {
  const items = orderForReturn.value?.items ?? []
  return items.reduce((sum, item) => {
    const qty = selectedItems.value[item.id] ?? 0
    return sum + qty * Number(item.unitPrice)
  }, 0)
})

const statusFormOpen = ref(false)
const nextStatus = ref<ReturnRequestStatus | ''>('')
const refundAmount = ref<number | ''>('')
const statusNote = ref('')

const columns: UiTableColumn<ReturnRequestSummary>[] = [
  { key: 'returnNumber', label: 'RMA' },
  { key: 'order', label: 'Pedido', width: '9rem' },
  { key: 'status', label: 'Estado', width: '9rem' },
  { key: 'reason', label: 'Motivo', width: '10rem' },
  { key: 'requestedAt', label: 'Solicitada', width: '9rem' },
]

function openDetail(item: ReturnRequestSummary) {
  selectedReturn.value = item
  detailOpen.value = true
}

function openStatusUpdate(item: ReturnRequestSummary) {
  selectedReturn.value = item
  nextStatus.value = ''
  refundAmount.value = ''
  statusNote.value = ''
  statusFormOpen.value = true
}

async function onCreate() {
  formError.value = ''
  if (!orderId.value.trim()) {
    formError.value = 'Selecciona un pedido.'
    return
  }
  const items = Object.entries(selectedItems.value)
    .filter(([, qty]) => qty > 0)
    .map(([orderItemId, quantity]) => ({ orderItemId, quantity }))
  if (!items.length) {
    formError.value = 'Selecciona al menos un ítem con cantidad mayor a 0.'
    return
  }
  try {
    await createMutation.mutateAsync({
      orderId: orderId.value.trim(),
      reason: reason.value,
      reasonNote: reasonNote.value.trim() || undefined,
      internalNotes: internalNotes.value.trim() || undefined,
      restockItems: restockItems.value,
      items,
    })
    useToast().success('Devolución creada')
    createOpen.value = false
    await refetch()
  } catch (error) {
    formError.value = useApiErrorMessage(error)
  }
}

async function onUpdateStatus() {
  if (!selectedReturn.value || !nextStatus.value) return
  await statusMutation.mutateAsync({
    id: selectedReturn.value.id,
    payload: {
      status: nextStatus.value,
      refundAmount: refundAmount.value === '' ? undefined : Number(refundAmount.value),
      internalNotes: statusNote.value.trim() || undefined,
    },
  })
  useToast().success('Estado actualizado')
  statusFormOpen.value = false
  detailOpen.value = false
  await refetch()
}
</script>

<template>
  <div>
    <UiFilterBar title="Devoluciones RMA">
      <UiSearchInput
        v-model="search"
        placeholder="Buscar por RMA o pedido…"
        class="min-w-[16rem] flex-1"
      />
      <UiSelect
        v-model="filterStatus"
        :options="[{ label: 'Todos los estados', value: '' }, ...RETURN_STATUS_OPTIONS]"
        placeholder="Estado"
        class="min-w-[10rem]"
      />
      <template #actions>
        <UiButton v-if="can('returns.write')" @click="createOpen = true">
          <UiIcon name="lucide:plus" :size="16" class="mr-2" />
          Nueva devolución
        </UiButton>
      </template>
    </UiFilterBar>

    <AdminCard no-padding>
      <UiDataTable
        :columns="columns"
        :rows="returns"
        :loading="isPending"
        empty-title="Sin devoluciones"
        empty-description="No hay solicitudes de devolución registradas."
      >
        <template #cell-returnNumber="{ row }">
          <button class="text-left font-medium hover:underline" @click="openDetail(row)">
            {{ row.returnNumber }}
          </button>
        </template>
        <template #cell-order="{ row }">
          {{ row.order.orderNumber }}
        </template>
        <template #cell-status="{ row }">
          <UiBadge :variant="returnStatusVariant(row.status)">
            {{ formatReturnStatus(row.status) }}
          </UiBadge>
        </template>
        <template #cell-reason="{ row }">
          {{ formatReturnReason(row.reason) }}
        </template>
        <template #cell-requestedAt="{ row }">
          {{ formatAdminDate(row.requestedAt) }}
        </template>
        <template #actions="{ row }">
          <div v-if="can('returns.write')" class="flex justify-end gap-1">
            <UiIconButton icon="lucide:eye" ariaLabel="Ver detalle" @click="openDetail(row)" />
            <UiIconButton
              icon="lucide:settings-2"
              ariaLabel="Cambiar estado"
              @click="openStatusUpdate(row)"
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

    <UiModal
      v-model="createOpen"
      title="Nueva devolución"
      description="Crea una solicitud RMA para un pedido entregado."
      size="lg"
    >
      <form class="space-y-4" @submit.prevent="onCreate">
        <UiAlert v-if="formError" variant="error">{{ formError }}</UiAlert>

        <div class="space-y-2">
          <div
            v-if="selectedOrderSummary"
            class="bg-admin-muted/40 flex items-start justify-between gap-3 rounded-md px-3 py-2 text-sm"
          >
            <span class="font-medium">{{ formatOrderLabel(selectedOrderSummary) }}</span>
            <button
              type="button"
              class="text-brand-accent shrink-0 text-xs hover:underline"
              @click="clearOrderSelection"
            >
              Cambiar pedido
            </button>
          </div>
          <template v-else>
            <UiInput
              v-model="orderSearch"
              label="Buscar pedido"
              placeholder="Número de pedido, cliente o correo…"
              autocomplete="off"
              required
              @update:model-value="scheduleOrderSearch"
            />
            <div v-if="isOrderSearching" class="text-admin-muted flex items-center gap-2 text-sm">
              <UiSpinner size="sm" />
              Buscando pedidos…
            </div>
            <div
              v-else-if="orderResults.length"
              class="border-admin-line max-h-40 overflow-auto rounded-lg border"
            >
              <button
                v-for="order in orderResults"
                :key="order.id"
                type="button"
                class="hover:bg-admin-surface block w-full px-3 py-2 text-left text-sm"
                @click="selectOrder(order)"
              >
                <span class="font-medium">{{ order.orderNumber }}</span>
                <span class="text-admin-muted block text-xs">
                  {{ order.customerName || order.customerEmail || 'Sin cliente' }} ·
                  {{ formatPrice(order.total, order.currencyCode) }}
                </span>
              </button>
            </div>
            <p v-else-if="orderSearch.trim().length >= 2" class="text-admin-muted text-sm">
              Sin pedidos entregados que coincidan.
            </p>
          </template>
        </div>

        <div v-if="orderLoading" class="text-admin-muted flex items-center gap-2 text-sm">
          <UiSpinner size="sm" />
          Cargando pedido…
        </div>
        <div v-else-if="orderForReturn" class="space-y-2">
          <p class="text-sm font-medium">
            Pedido {{ orderForReturn.orderNumber }}
            <UiBadge class="ml-2" :variant="orderStatusVariant(orderForReturn.status)">
              {{ formatOrderStatus(orderForReturn.status) }}
            </UiBadge>
          </p>
          <p class="text-admin-muted text-xs">
            Selecciona los productos a devolver y, si aplica, la cantidad.
          </p>
          <div
            v-for="item in orderForReturn.items"
            :key="item.id"
            class="border-admin-line flex items-center justify-between gap-3 rounded-lg border px-3 py-2"
            :class="isItemSelected(item.id) && 'border-brand-accent bg-brand-accent/5'"
          >
            <label class="flex min-w-0 flex-1 cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                class="border-store-line text-brand-accent mt-1 h-4 w-4 shrink-0 rounded focus:ring-[var(--brand-cyan)]"
                :checked="isItemSelected(item.id)"
                @change="toggleItem(item, ($event.target as HTMLInputElement).checked)"
              />
              <span class="min-w-0 text-sm">
                <span class="block font-medium">{{ item.productName }}</span>
                <span class="text-admin-muted block text-xs">
                  {{ item.sku }} · {{ formatPrice(item.unitPrice, orderForReturn.currencyCode) }} c/u
                  · máx. {{ item.quantity }}
                </span>
              </span>
            </label>
            <UiInput
              v-if="isItemSelected(item.id) && item.quantity > 1"
              :model-value="selectedItems[item.id] ?? 0"
              type="number"
              :min="1"
              :max="item.quantity"
              class="w-20 shrink-0"
              @update:model-value="onItemQuantityInput(item, $event)"
            />
          </div>
          <p v-if="selectedItemsTotal > 0" class="text-right text-sm">
            Total estimado a reembolsar:
            <span class="font-medium">
              {{ formatPrice(selectedItemsTotal, orderForReturn.currencyCode) }}
            </span>
          </p>
        </div>
        <UiSelect v-model="reason" label="Motivo" :options="RETURN_REASON_OPTIONS" />
        <UiInput v-model="reasonNote" label="Nota del motivo" />
        <UiInput v-model="internalNotes" label="Notas internas" />
        <UiCheckbox v-model="restockItems" label="Reingresar stock al recibir" />
      </form>
      <template #footer>
        <AdminModalFooter
          submit-label="Crear devolución"
          :loading="createMutation.isPending.value"
          @cancel="createOpen = false"
          @submit="onCreate"
        />
      </template>
    </UiModal>

    <UiModal
      v-model="detailOpen"
      title="Detalle de devolución"
      :description="selectedReturn?.returnNumber"
      size="lg"
    >
      <div v-if="selectedReturn" class="space-y-4">
        <div class="flex flex-wrap items-center gap-2">
          <UiBadge :variant="returnStatusVariant(selectedReturn.status)">
            {{ formatReturnStatus(selectedReturn.status) }}
          </UiBadge>
          <span class="text-admin-muted text-sm">
            Pedido {{ selectedReturn.order.orderNumber }}
          </span>
        </div>
        <AdminFormSection title="Información" icon="lucide:info">
          <div class="grid gap-3 sm:grid-cols-2">
            <AdminDetailCell label="Motivo">
              {{ formatReturnReason(selectedReturn.reason) }}
            </AdminDetailCell>
            <AdminDetailCell label="Reingreso stock">
              {{ selectedReturn.restockItems ? 'Sí' : 'No' }}
            </AdminDetailCell>
            <AdminDetailCell v-if="selectedReturn.reasonNote" label="Nota" class="sm:col-span-2">
              {{ selectedReturn.reasonNote }}
            </AdminDetailCell>
            <AdminDetailCell v-if="selectedReturn.refundAmount" label="Reembolso">
              {{ formatPrice(selectedReturn.refundAmount, selectedReturn.order.currencyCode) }}
            </AdminDetailCell>
          </div>
        </AdminFormSection>
        <AdminFormSection v-if="selectedReturn.items.length" title="Ítems" icon="lucide:package">
          <div class="space-y-2 text-sm">
            <div
              v-for="item in selectedReturn.items"
              :key="item.id"
              class="flex justify-between border-b py-2 last:border-0"
            >
              <span>{{ item.orderItem.productName }} ({{ item.orderItem.sku }})</span>
              <span>{{ item.quantity }} uds.</span>
            </div>
          </div>
        </AdminFormSection>
      </div>
      <template #footer>
        <UiButton variant="ghost" @click="detailOpen = false">Cerrar</UiButton>
        <UiButton
          v-if="can('returns.write') && selectedReturn"
          @click="openStatusUpdate(selectedReturn)"
        >
          Cambiar estado
        </UiButton>
      </template>
    </UiModal>

    <UiModal
      v-model="statusFormOpen"
      title="Actualizar estado"
      :description="selectedReturn?.returnNumber"
    >
      <div class="space-y-4">
        <UiSelect
          v-model="nextStatus"
          label="Nuevo estado"
          :options="[{ label: 'Seleccionar…', value: '' }, ...RETURN_STATUS_OPTIONS]"
        />
        <UiInput
          v-if="nextStatus === 'REFUNDED'"
          v-model.number="refundAmount"
          label="Monto de reembolso"
          type="number"
          min="0"
          step="0.01"
        />
        <UiInput v-model="statusNote" label="Notas internas" />
      </div>
      <template #footer>
        <AdminModalFooter
          submit-label="Aplicar"
          :loading="statusMutation.isPending.value"
          :show-submit="!!nextStatus"
          @cancel="statusFormOpen = false"
          @submit="onUpdateStatus"
        />
      </template>
    </UiModal>
  </div>
</template>
