<script setup lang="ts">
import { processMercadoPagoPayment } from '~/api/store-mercadopago.api'
import {
  getMercadoPagoClient,
  type MercadoPagoCardPaymentBrickController,
} from '~/utils/mercadopago'

const props = defineProps<{
  orderId: string
  amount: number
  payerEmail: string
  publicKey: string
}>()

const emit = defineEmits<{
  success: [orderNumber: string]
  error: [message: string]
}>()

const toast = useToast()
const ready = ref(false)
const initError = ref('')

const containerId = `cardPaymentBrick_${props.orderId}`
let brickController: MercadoPagoCardPaymentBrickController | null = null

async function initBrick() {
  initError.value = ''
  ready.value = false
  brickController?.unmount()
  brickController = null

  try {
    const mp = await getMercadoPagoClient(props.publicKey)
    const bricksBuilder = mp.bricks()

    brickController = await bricksBuilder.create('cardPayment', containerId, {
      initialization: {
        amount: props.amount,
        payer: {
          email: props.payerEmail,
        },
      },
      customization: {
        visual: {
          style: {
            theme: 'default',
          },
        },
      },
      callbacks: {
        onReady: () => {
          ready.value = true
        },
        onError: (error) => {
          console.error('Mercado Pago Card Payment Brick error', error)
        },
        onSubmit: async (formData, additionalData) => {
          const result = await processMercadoPagoPayment(props.orderId, {
            paymentChannel: 'card',
            token: formData.token,
            paymentMethodId: formData.payment_method_id,
            paymentMethodType: additionalData?.paymentTypeId,
            installments: formData.installments || 1,
            payerEmail: formData.payer.email || props.payerEmail,
            payerIdentification: formData.payer.identification,
          })

          if (result.approved) {
            toast.success('Pago aprobado')
            emit('success', result.orderNumber)
            return
          }

          const message =
            result.statusDetail ??
            'El pago quedó pendiente. Revisa tu correo o intenta de nuevo.'
          emit('error', message)
          throw new Error(message)
        },
      },
    })
  } catch (error) {
    initError.value = useApiErrorMessage(error)
  }
}

onMounted(() => {
  void initBrick()
})

onBeforeUnmount(() => {
  brickController?.unmount()
  brickController = null
})
</script>

<template>
  <div class="space-y-4">
    <p class="text-theme-muted text-sm">
      Paga con tarjeta de crédito o débito mediante el formulario seguro de
      Mercado Pago (Card Payment Brick).
    </p>

    <UiErrorState
      v-if="initError"
      title="No pudimos cargar el formulario de pago"
      :description="initError"
      @retry="initBrick"
    />

    <div v-else class="space-y-3">
      <div v-if="!ready" class="py-6">
        <UiSkeleton tone="store" height="16rem" rounded="lg" />
      </div>
      <div :id="containerId" :class="{ 'opacity-0': !ready }" />
    </div>
  </div>
</template>
