<script setup lang="ts">
import type { OrderDetail, RefundType } from '~/types/admin-orders'

const open = defineModel<boolean>({ required: true })

const props = defineProps<{
  order: OrderDetail | null | undefined
}>()

const emit = defineEmits<{
  refunded: []
}>()

const toast = useToast()
const refundMutation = useAdminRefundOrderMutation()

const refundType = ref<RefundType>('full')
const refundAmount = ref('')
const refundNote = ref('')
const restockItems = ref(true)
const submitError = ref('')

const isGatewayOrder = computed(() => props.order?.paymentMethod === 'GATEWAY')

watch(open, (isOpen) => {
  if (!isOpen) return
  refundType.value = 'full'
  refundAmount.value = ''
  refundNote.value = ''
  submitError.value = ''
  restockItems.value = props.order?.fulfillmentStatus === 'FULFILLED'
})

watch(
  () => props.order?.fulfillmentStatus,
  (status) => {
    if (open.value) {
      restockItems.value = status === 'FULFILLED'
    }
  },
)

const canSubmit = computed(() => {
  if (!props.order) return false
  if (refundType.value === 'full') return true
  const amount = Number(refundAmount.value)
  const total = Number(props.order.total)
  return Number.isFinite(amount) && amount > 0 && amount <= total
})

async function submitRefund() {
  if (!props.order || !canSubmit.value) return

  submitError.value = ''

  const payload =
    refundType.value === 'full'
      ? {
          type: 'full' as const,
          note: refundNote.value || undefined,
          restockItems: restockItems.value,
        }
      : {
          type: 'partial' as const,
          amount: Number(refundAmount.value),
          note: refundNote.value || undefined,
          restockItems: restockItems.value,
        }

  try {
    await refundMutation.mutateAsync({ id: props.order.id, payload })
    toast.success(
      refundType.value === 'full' ? 'Reembolso total registrado' : 'Reembolso parcial registrado',
    )
    open.value = false
    emit('refunded')
  } catch (error) {
    submitError.value = useApiErrorMessage(error)
    toast.error(submitError.value)
  }
}
</script>

<template>
  <UiModal
    v-model="open"
    title="Registrar reembolso"
    :description="order?.orderNumber"
    size="md"
    elevated
  >
    <div v-if="order" class="space-y-4">
      <p class="text-admin-muted text-sm">
        Total del pedido:
        <strong class="text-admin-fg">{{ formatPrice(order.total, order.currencyCode) }}</strong>
      </p>

      <UiAlert v-if="isGatewayOrder" variant="info">
        Este pedido se pagó con Mercado Pago. Al confirmar, se enviará automáticamente la
        solicitud de reembolso a Mercado Pago antes de actualizar el estado del pedido. Si
        Mercado Pago la rechaza, el pedido no se marcará como reembolsado.
      </UiAlert>

      <UiAlert v-if="submitError" variant="error">{{ submitError }}</UiAlert>

      <div class="space-y-2">
        <p class="text-sm font-medium">Tipo de reembolso</p>
        <div class="grid gap-2 sm:grid-cols-2">
          <label
            class="border-admin-line flex cursor-pointer items-start gap-3 rounded-lg border p-3"
            :class="refundType === 'full' ? 'border-violet-500 bg-violet-50/50' : ''"
          >
            <input v-model="refundType" type="radio" value="full" class="mt-1" />
            <span>
              <span class="block text-sm font-medium">Total</span>
              <span class="text-admin-muted text-xs">
                Marca el pedido como reembolsado y el pago como devuelto.
              </span>
            </span>
          </label>
          <label
            class="border-admin-line flex cursor-pointer items-start gap-3 rounded-lg border p-3"
            :class="refundType === 'partial' ? 'border-violet-500 bg-violet-50/50' : ''"
          >
            <input v-model="refundType" type="radio" value="partial" class="mt-1" />
            <span>
              <span class="block text-sm font-medium">Parcial</span>
              <span class="text-admin-muted text-xs">
                El pedido sigue entregado; solo cambia el estado de pago.
              </span>
            </span>
          </label>
        </div>
      </div>

      <UiInput
        v-if="refundType === 'partial'"
        v-model="refundAmount"
        type="number"
        min="0.01"
        :max="order.total"
        step="0.01"
        label="Monto reembolsado"
        placeholder="0.00"
      />

      <UiInput v-model="refundNote" label="Nota (opcional)" placeholder="Motivo o referencia" />

      <UiCheckbox
        v-model="restockItems"
        label="Devolver stock al almacén"
        hint="Recomendado si los productos regresan al inventario."
      />
    </div>

    <template #footer>
      <UiButton variant="ghost" @click="open = false">Cancelar</UiButton>
      <UiButton
        :disabled="!canSubmit"
        :loading="refundMutation.isPending.value"
        @click="submitRefund"
      >
        Confirmar reembolso
      </UiButton>
    </template>
  </UiModal>
</template>
