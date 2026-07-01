<script setup lang="ts">
import type { OrderPaymentMethod, OrderPaymentStatus, OrderStatus } from '~/types/admin-orders'
import { formatPaymentMethod, PAYMENT_METHOD_OPTIONS } from '~/utils/format-payment-method'
import {
  formatDeliveryMethod,
  formatFulfillmentStatus,
  formatOrderStatus,
  formatPaymentStatus,
  fulfillmentStatusVariant,
  OPERATIONAL_ORDER_STATUS_OPTIONS,
  OPERATIONAL_PAYMENT_STATUS_OPTIONS,
  orderStatusVariant,
  paymentStatusVariant,
} from '~/utils/format-order'

function resolveOperationalDefault<T extends string>(
  current: T,
  options: Array<{ value: T; label: string }>,
): T | '' {
  return options.some((option) => option.value === current) ? current : ''
}

const open = defineModel<boolean>({ required: true })

const props = defineProps<{
  orderId: string | null
}>()

const { can } = useAdminPermissions()
const toast = useToast()
const { data: storeSettings } = useAdminStoreSettingsQuery()

const orderIdRef = computed(() => (open.value ? props.orderId : null))
const { data: order, isPending, refetch } = useAdminOrderQuery(orderIdRef)

const { data: paymentTransactions } = useAdminPaymentTransactionsQuery(
  computed(() => (order.value?.paymentMethod === 'GATEWAY' ? order.value.id : undefined)),
)
const gatewayTransaction = computed(() => paymentTransactions.value?.[0] ?? null)

const statusMutation = useAdminUpdateOrderStatusMutation()
const paymentMutation = useAdminUpdateOrderPaymentMutation()
const cancelMutation = useAdminCancelOrderMutation()
const shipmentMutation = useAdminUpdateOrderShipmentMutation()
const notesMutation = useAdminUpdateOrderNotesMutation()
const evidenceMutation = useAdminUploadOrderPaymentEvidenceMutation()

const refundOpen = ref(false)

const nextStatus = ref<OrderStatus | ''>('')
const statusNote = ref('')
const nextPaymentStatus = ref<OrderPaymentStatus | ''>('')
const paymentNote = ref('')

const trackingNumber = ref('')
const carrier = ref('')
const trackingUrl = ref('')
const shippingNotes = ref('')
const internalNotes = ref('')
const customerNotes = ref('')
const evidenceFile = ref<File | null>(null)
const evidenceMethod = ref<OrderPaymentMethod>('BANK_TRANSFER')
const evidencePaymentMethodOptions = PAYMENT_METHOD_OPTIONS.filter(
  (option) => option.value !== 'GATEWAY',
)
const evidenceAmount = ref<number | ''>('')
const evidenceNote = ref('')

watch(order, (value) => {
  if (!value) return
  const allowedStatuses = OPERATIONAL_ORDER_STATUS_OPTIONS.filter((option) =>
    value.deliveryMethod === 'PICKUP'
      ? option.value !== 'SHIPPED'
      : option.value !== 'READY_FOR_PICKUP',
  )
  nextStatus.value = resolveOperationalDefault(value.status, allowedStatuses)
  nextPaymentStatus.value = resolveOperationalDefault(
    value.paymentStatus,
    OPERATIONAL_PAYMENT_STATUS_OPTIONS,
  )
  statusNote.value = ''
  paymentNote.value = ''
  trackingNumber.value = value.trackingNumber ?? ''
  carrier.value = value.carrier ?? ''
  trackingUrl.value = value.trackingUrl ?? ''
  shippingNotes.value = value.shippingNotes ?? ''
  internalNotes.value = value.internalNotes ?? ''
  customerNotes.value = value.customerNotes ?? ''
  evidenceFile.value = null
  evidenceAmount.value = ''
  evidenceNote.value = ''
})

const isUpdating = computed(
  () =>
    statusMutation.isPending.value ||
    paymentMutation.isPending.value ||
    cancelMutation.isPending.value ||
    shipmentMutation.isPending.value ||
    notesMutation.isPending.value ||
    evidenceMutation.isPending.value,
)

const canCancel = computed(() => {
  if (!order.value) return false
  return !['CANCELLED', 'REFUNDED', 'DELIVERED'].includes(order.value.status)
})

const canRefund = computed(() => {
  if (!order.value) return false
  return (
    order.value.status === 'DELIVERED' &&
    ['PAID', 'PARTIALLY_REFUNDED'].includes(order.value.paymentStatus)
  )
})

const statusOptions = computed(() => {
  if (!order.value) return OPERATIONAL_ORDER_STATUS_OPTIONS
  const base = OPERATIONAL_ORDER_STATUS_OPTIONS
  if (order.value.deliveryMethod === 'PICKUP') {
    return base.filter((option) => option.value !== 'SHIPPED')
  }
  return base.filter((option) => option.value !== 'READY_FOR_PICKUP')
})

function printOrder() {
  window.print()
}

async function applyStatus() {
  if (!order.value || !nextStatus.value) return
  await statusMutation.mutateAsync({
    id: order.value.id,
    payload: {
      status: nextStatus.value,
      note: statusNote.value || undefined,
    },
  })
  toast.success('Estado actualizado')
  await refetch()
}

async function applyPayment() {
  if (!order.value || !nextPaymentStatus.value) return
  await paymentMutation.mutateAsync({
    id: order.value.id,
    payload: {
      paymentStatus: nextPaymentStatus.value,
      note: paymentNote.value || undefined,
    },
  })
  toast.success('Pago actualizado')
  await refetch()
}

async function saveShipment() {
  if (!order.value) return
  await shipmentMutation.mutateAsync({
    id: order.value.id,
    payload: {
      trackingNumber: trackingNumber.value.trim() || undefined,
      carrier: carrier.value.trim() || undefined,
      trackingUrl: trackingUrl.value.trim() || undefined,
      shippingNotes: shippingNotes.value.trim() || undefined,
    },
  })
  toast.success('Datos de envío actualizados')
  await refetch()
}

async function saveNotes() {
  if (!order.value) return
  await notesMutation.mutateAsync({
    id: order.value.id,
    payload: {
      internalNotes: internalNotes.value.trim() || undefined,
      customerNotes: customerNotes.value.trim() || undefined,
    },
  })
  toast.success('Notas actualizadas')
  await refetch()
}

async function uploadEvidence() {
  if (!order.value || !evidenceFile.value) return
  await evidenceMutation.mutateAsync({
    id: order.value.id,
    payload: {
      file: evidenceFile.value,
      paymentMethod: evidenceMethod.value,
      amount: evidenceAmount.value === '' ? undefined : Number(evidenceAmount.value),
      note: evidenceNote.value.trim() || undefined,
    },
  })
  toast.success('Comprobante registrado')
  evidenceFile.value = null
  await refetch()
}

function cancelOrder() {
  if (!order.value) return
  return runAdminSuspendAction({
    confirm: {
      title: 'Cancelar pedido',
      message: `¿Cancelar el pedido ${order.value.orderNumber}? Se liberará el stock reservado.`,
      confirmLabel: 'Cancelar pedido',
    },
    mutate: async () => {
      await cancelMutation.mutateAsync({ id: order.value!.id })
      await refetch()
    },
    successMessage: 'Pedido cancelado',
  })
}

function formatAddress(address: {
  addressLine1: string
  addressLine2: string | null
  district: string | null
  province: string | null
  department: string | null
  country: string
}) {
  return [
    address.addressLine1,
    address.addressLine2,
    address.district,
    address.province,
    address.department,
    address.country,
  ]
    .filter(Boolean)
    .join(', ')
}
</script>

<template>
  <UiModal
    v-model="open"
    title="Detalle del pedido"
    :description="order?.orderNumber"
    size="xl"
  >
    <div v-if="isPending && !order" class="text-admin-muted flex items-center gap-2 py-8 text-sm">
      <UiSpinner size="sm" />
      Cargando pedido…
    </div>

    <div v-else-if="order" class="space-y-5">
      <div class="flex flex-wrap items-center gap-2">
        <UiBadge :variant="orderStatusVariant(order.status)">
          {{ formatOrderStatus(order.status) }}
        </UiBadge>
        <UiBadge :variant="paymentStatusVariant(order.paymentStatus)">
          {{ formatPaymentStatus(order.paymentStatus) }}
        </UiBadge>
        <UiBadge :variant="fulfillmentStatusVariant(order.fulfillmentStatus)">
          {{ formatFulfillmentStatus(order.fulfillmentStatus) }}
        </UiBadge>
        <UiBadge variant="default">
          {{ formatDeliveryMethod(order.deliveryMethod) }}
        </UiBadge>
        <span class="text-admin-muted text-xs">
          {{ order.warehouseName || 'Sin almacén' }} · {{ formatAdminDateTime(order.createdAt) }}
        </span>
      </div>

      <AdminFormSection title="Seguimiento" icon="lucide:truck">
        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <AdminDetailCell label="Despacho">
            <UiBadge :variant="fulfillmentStatusVariant(order.fulfillmentStatus)">
              {{ formatFulfillmentStatus(order.fulfillmentStatus) }}
            </UiBadge>
          </AdminDetailCell>
          <AdminDetailCell label="Confirmado">
            {{ order.confirmedAt ? formatAdminDateTime(order.confirmedAt) : '—' }}
          </AdminDetailCell>
          <AdminDetailCell label="Enviado">
            {{ order.shippedAt ? formatAdminDateTime(order.shippedAt) : '—' }}
          </AdminDetailCell>
          <AdminDetailCell label="Entregado">
            {{ order.deliveredAt ? formatAdminDateTime(order.deliveredAt) : '—' }}
          </AdminDetailCell>
          <AdminDetailCell v-if="order.paymentMethod" label="Método de pago">
            {{ formatPaymentMethod(order.paymentMethod) }}
          </AdminDetailCell>
          <AdminDetailCell v-if="order.trackingNumber" label="Tracking">
            {{ order.trackingNumber }}
            <span v-if="order.carrier" class="text-admin-muted"> · {{ order.carrier }}</span>
          </AdminDetailCell>
        </div>
        <p v-if="order.trackingUrl" class="text-admin-muted mt-2 text-sm">
          <a :href="order.trackingUrl" target="_blank" rel="noopener" class="underline">
            Ver seguimiento
          </a>
        </p>
      </AdminFormSection>

      <AdminFormSection
        v-if="order.paymentMethod === 'GATEWAY'"
        title="Pago con Mercado Pago"
        icon="lucide:landmark"
      >
        <div v-if="gatewayTransaction" class="grid gap-3 sm:grid-cols-2">
          <AdminDetailCell label="ID de orden en Mercado Pago">
            <code class="text-xs">{{ gatewayTransaction.externalId ?? '—' }}</code>
          </AdminDetailCell>
          <AdminDetailCell label="Estado de la transacción">
            <UiBadge
              :variant="
                gatewayTransaction.status === 'COMPLETED'
                  ? 'success'
                  : gatewayTransaction.status === 'FAILED'
                    ? 'danger'
                    : gatewayTransaction.status === 'REFUNDED'
                      ? 'info'
                      : 'warning'
              "
            >
              {{ gatewayTransaction.status }}
            </UiBadge>
          </AdminDetailCell>
          <AdminDetailCell label="Monto">
            {{ formatPrice(gatewayTransaction.amount, gatewayTransaction.currencyCode) }}
          </AdminDetailCell>
          <AdminDetailCell label="Última actualización">
            {{ formatAdminDateTime(gatewayTransaction.updatedAt) }}
          </AdminDetailCell>
        </div>
        <p v-else class="text-admin-muted text-sm">
          Aún no hay una transacción registrada para este pedido.
        </p>
      </AdminFormSection>

      <AdminFormSection
        v-if="can('orders.write') && order.deliveryMethod === 'SHIPPING'"
        title="Datos de envío"
        icon="lucide:package-check"
      >
        <div class="grid gap-3 sm:grid-cols-2">
          <UiInput v-model="trackingNumber" label="Número de tracking" />
          <UiInput v-model="carrier" label="Transportista" />
          <UiInput v-model="trackingUrl" label="URL de seguimiento" class="sm:col-span-2" />
          <UiInput v-model="shippingNotes" label="Notas de envío" class="sm:col-span-2" />
        </div>
        <UiButton
          size="sm"
          class="mt-3"
          :loading="shipmentMutation.isPending.value"
          @click="saveShipment"
        >
          Guardar envío
        </UiButton>
      </AdminFormSection>

      <AdminFormSection title="Notas" icon="lucide:sticky-note">
        <div v-if="!can('orders.write')" class="grid gap-3 sm:grid-cols-2">
          <AdminDetailCell v-if="order.customerNotes" label="Cliente">
            {{ order.customerNotes }}
          </AdminDetailCell>
          <AdminDetailCell v-if="order.internalNotes" label="Internas">
            {{ order.internalNotes }}
          </AdminDetailCell>
          <p
            v-if="!order.customerNotes && !order.internalNotes"
            class="text-admin-muted text-sm"
          >
            Sin notas registradas.
          </p>
        </div>
        <div v-else class="space-y-3">
          <UiInput v-model="customerNotes" label="Notas del cliente" />
          <UiInput v-model="internalNotes" label="Notas internas" />
          <UiButton size="sm" :loading="notesMutation.isPending.value" @click="saveNotes">
            Guardar notas
          </UiButton>
        </div>
      </AdminFormSection>

      <AdminFormSection
        v-if="order.paymentEvidences?.length"
        title="Comprobantes de pago"
        icon="lucide:receipt-text"
      >
        <div class="space-y-3">
          <div
            v-for="evidence in order.paymentEvidences"
            :key="evidence.id"
            class="border-admin-line flex flex-wrap items-center justify-between gap-3 rounded-lg border px-3 py-2 text-sm"
          >
            <div>
              <p class="font-medium">{{ formatPaymentMethod(evidence.paymentMethod) }}</p>
              <p class="text-admin-muted text-xs">
                {{ formatAdminDateTime(evidence.createdAt) }}
                <span v-if="evidence.uploadedByName"> · {{ evidence.uploadedByName }}</span>
              </p>
              <p v-if="evidence.amount" class="text-xs">
                {{ formatPrice(evidence.amount, order.currencyCode) }}
              </p>
            </div>
            <a
              v-if="evidence.fileUrl"
              :href="evidence.fileUrl"
              target="_blank"
              rel="noopener"
              class="text-admin-primary text-sm underline"
            >
              Ver archivo
            </a>
          </div>
        </div>
      </AdminFormSection>

      <AdminFormSection
        v-if="can('orders.write')"
        title="Subir comprobante"
        icon="lucide:upload"
      >
        <div class="grid gap-3 sm:grid-cols-2">
          <UiSelect
            v-model="evidenceMethod"
            label="Método de pago"
            :options="evidencePaymentMethodOptions"
            class="sm:col-span-2"
          />
          <UiInput v-model.number="evidenceAmount" label="Monto" type="number" min="0" step="0.01" />
          <UiInput v-model="evidenceNote" label="Nota" />
        </div>
        <div class="mt-3">
          <UiFileUpload
            v-model="evidenceFile"
            label="Comprobante"
            accept="image/*,application/pdf"
            hint="Imagen o PDF, máx. 5 MB"
          />
        </div>
        <UiButton
          size="sm"
          class="mt-3"
          :disabled="!evidenceFile"
          :loading="evidenceMutation.isPending.value"
          @click="uploadEvidence"
        >
          Subir comprobante
        </UiButton>
      </AdminFormSection>

      <AdminFormSection title="Cliente" icon="lucide:user">
        <div class="grid gap-3 sm:grid-cols-2">
          <AdminDetailCell label="Nombre">
            <p class="font-medium">{{ order.customerName || '—' }}</p>
          </AdminDetailCell>
          <AdminDetailCell label="Correo">
            {{ order.customerEmail || '—' }}
          </AdminDetailCell>
          <AdminDetailCell v-if="order.guestPhone" label="Teléfono">
            {{ order.guestPhone }}
          </AdminDetailCell>
        </div>
      </AdminFormSection>

      <AdminFormSection title="Ítems" icon="lucide:package">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="text-admin-muted border-admin-line border-b text-left">
                <th class="px-2 py-2 font-medium">Producto</th>
                <th class="px-2 py-2 font-medium">SKU</th>
                <th class="px-2 py-2 text-right font-medium">Cant.</th>
                <th class="px-2 py-2 text-right font-medium">Precio</th>
                <th class="px-2 py-2 text-right font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in order.items"
                :key="item.id"
                class="border-admin-line border-b last:border-0"
              >
                <td class="px-2 py-2">
                  <p class="font-medium">{{ item.productName }}</p>
                  <p v-if="item.variantName" class="text-admin-muted text-xs">{{ item.variantName }}</p>
                </td>
                <td class="text-admin-muted px-2 py-2">{{ item.sku }}</td>
                <td class="px-2 py-2 text-right">{{ item.quantity }}</td>
                <td class="px-2 py-2 text-right">
                  {{ formatPrice(item.unitPrice, order.currencyCode) }}
                </td>
                <td class="px-2 py-2 text-right font-medium">
                  {{ formatPrice(item.lineTotal, order.currencyCode) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </AdminFormSection>

      <AdminFormSection title="Totales" icon="lucide:receipt">
        <div class="grid gap-2 text-sm sm:max-w-sm sm:ml-auto">
          <div class="flex justify-between">
            <span class="text-admin-muted">Subtotal</span>
            <span>{{ formatPrice(order.subtotal, order.currencyCode) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-admin-muted">
              Impuesto{{ order.taxRateName ? ` (${order.taxRateName})` : '' }}
            </span>
            <span>{{ formatPrice(order.taxAmount, order.currencyCode) }}</span>
          </div>
          <div v-if="order.deliveryMethod === 'SHIPPING'" class="flex justify-between">
            <span class="text-admin-muted">Envío</span>
            <span>{{ formatPrice(order.shippingAmount, order.currencyCode) }}</span>
          </div>
          <div v-if="Number(order.discountAmount) > 0" class="flex justify-between">
            <span class="text-admin-muted">Descuento</span>
            <span>-{{ formatPrice(order.discountAmount, order.currencyCode) }}</span>
          </div>
          <div class="border-admin-line flex justify-between border-t pt-2 text-base font-semibold">
            <span>Total</span>
            <span>{{ formatPrice(order.total, order.currencyCode) }}</span>
          </div>
        </div>
      </AdminFormSection>

      <AdminFormSection
        v-if="order.deliveryMethod === 'PICKUP'"
        title="Entrega"
        icon="lucide:store"
      >
        <div class="space-y-2 text-sm">
          <p>Recojo en tienda{{ order.warehouseName ? ` · ${order.warehouseName}` : '' }}</p>
          <template v-if="storeSettings && hasPickupPoint(storeSettings)">
            <p v-if="storeSettings.pickupPointName" class="font-medium">
              {{ storeSettings.pickupPointName }}
            </p>
            <p v-if="formatPickupPointAddress(storeSettings)" class="text-admin-muted">
              {{ formatPickupPointAddress(storeSettings) }}
            </p>
            <p v-if="storeSettings.pickupPointPhone" class="text-admin-muted">
              Tel: {{ storeSettings.pickupPointPhone }}
            </p>
            <p v-if="storeSettings.pickupPointHours" class="text-admin-muted">
              Horario: {{ storeSettings.pickupPointHours }}
            </p>
          </template>
        </div>
      </AdminFormSection>

      <AdminFormSection
        v-else-if="order.addresses.length"
        title="Direcciones"
        icon="lucide:map-pin"
      >
        <div class="grid gap-3 sm:grid-cols-2">
          <AdminDetailCell
            v-for="address in order.addresses"
            :key="address.id"
            :label="address.type === 'SHIPPING' ? 'Envío' : 'Facturación'"
          >
            <p class="text-sm">{{ formatAddress(address) }}</p>
          </AdminDetailCell>
        </div>
      </AdminFormSection>

      <AdminFormSection
        v-if="order.statusHistory.length"
        title="Historial"
        icon="lucide:history"
      >
        <div class="space-y-3">
          <div
            v-for="entry in order.statusHistory"
            :key="entry.id"
            class="border-admin-line rounded-lg border px-3 py-2 text-sm"
          >
            <div class="flex flex-wrap items-center gap-2">
              <UiBadge :variant="orderStatusVariant(entry.toStatus)">
                {{ formatOrderStatus(entry.toStatus) }}
              </UiBadge>
              <span v-if="entry.toPaymentStatus" class="text-admin-muted text-xs">
                Pago: {{ formatPaymentStatus(entry.toPaymentStatus) }}
              </span>
              <span class="text-admin-muted ml-auto text-xs">
                {{ formatAdminDateTime(entry.createdAt) }}
              </span>
            </div>
            <p v-if="entry.note" class="text-admin-muted mt-1 text-xs">{{ entry.note }}</p>
            <p v-if="entry.performedByName" class="text-admin-muted mt-1 text-xs">
              Por {{ entry.performedByName }}
            </p>
          </div>
        </div>
      </AdminFormSection>

      <AdminFormSection
        v-if="can('orders.write')"
        title="Gestionar pedido"
        icon="lucide:settings-2"
      >
        <div class="grid gap-4 lg:grid-cols-2">
          <div class="space-y-3">
            <p class="text-sm font-medium">
              Cambiar estado
              <span class="text-admin-muted font-normal">
                · Actual: {{ formatOrderStatus(order.status) }}
              </span>
            </p>
            <UiSelect
              v-model="nextStatus"
              :options="[{ label: 'Seleccionar…', value: '' }, ...statusOptions]"
              placeholder="Nuevo estado"
            />
            <UiInput v-model="statusNote" placeholder="Nota opcional" />
            <UiButton
              size="sm"
              :disabled="!nextStatus || nextStatus === order.status"
              :loading="statusMutation.isPending.value"
              @click="applyStatus"
            >
              Aplicar estado
            </UiButton>
          </div>
          <div class="space-y-3">
            <p class="text-sm font-medium">
              Cambiar pago
              <span class="text-admin-muted font-normal">
                · Actual: {{ formatPaymentStatus(order.paymentStatus) }}
              </span>
            </p>
            <UiSelect
              v-model="nextPaymentStatus"
              :options="[
                { label: 'Seleccionar…', value: '' },
                ...OPERATIONAL_PAYMENT_STATUS_OPTIONS,
              ]"
              placeholder="Estado de pago"
            />
            <UiInput v-model="paymentNote" placeholder="Nota opcional" />
            <UiButton
              size="sm"
              :disabled="!nextPaymentStatus || nextPaymentStatus === order.paymentStatus"
              :loading="paymentMutation.isPending.value"
              @click="applyPayment"
            >
              Aplicar pago
            </UiButton>
          </div>
        </div>
      </AdminFormSection>
    </div>

    <AdminOrderPrintSheet
      v-if="order"
      :order="order"
      :pickup-point="storeSettings && hasPickupPoint(storeSettings) ? storeSettings : null"
    />

    <AdminOrderRefundModal
      v-model="refundOpen"
      :order="order"
      @refunded="refetch"
    />

    <template #footer>
      <UiButton v-if="order" variant="ghost" @click="printOrder">
        <UiIcon name="lucide:printer" :size="16" class="mr-2" />
        Imprimir
      </UiButton>
      <UiButton variant="ghost" @click="open = false">Cerrar</UiButton>
      <UiButton
        v-if="can('orders.write') && canRefund"
        variant="secondary"
        @click="refundOpen = true"
      >
        Reembolsar
      </UiButton>
      <UiButton
        v-if="can('orders.write') && canCancel"
        variant="secondary"
        :loading="cancelMutation.isPending.value"
        @click="cancelOrder"
      >
        Cancelar pedido
      </UiButton>
    </template>
  </UiModal>
</template>
