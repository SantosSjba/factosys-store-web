<script setup lang="ts">
import { processMercadoPagoPayment } from '~/api/store-mercadopago.api'
import {
  getMercadoPagoClient,
  type MercadoPagoCardPaymentBrickController,
} from '~/utils/mercadopago'
import { resolveMercadoPagoPayerEmail } from '~/utils/mercadopago-sandbox'

const props = defineProps<{
  orderId: string
  amount: number
  payerEmail: string
  publicKey: string
  isTestMode?: boolean
}>()

const emit = defineEmits<{
  success: [orderNumber: string]
  pending: [orderNumber: string]
  error: [message: string]
}>()

const toast = useToast()
const ready = ref(false)
const initError = ref('')

const containerId = `mpCardForm_${props.orderId}`
let cardFormController: MercadoPagoCardPaymentBrickController | null = null

const mpPayerEmail = computed(() =>
  resolveMercadoPagoPayerEmail(props.payerEmail, props.isTestMode),
)

async function initCardForm() {
  initError.value = ''
  ready.value = false
  cardFormController?.unmount()
  cardFormController = null

  try {
    const mp = await getMercadoPagoClient(props.publicKey)
    const bricksBuilder = mp.bricks()

    cardFormController = await bricksBuilder.create('cardPayment', containerId, {
      initialization: {
        amount: props.amount,
        payer: {
          email: mpPayerEmail.value,
          ...(props.isTestMode
            ? { identification: { type: 'DNI', number: '123456789' } }
            : {}),
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
        onError: () => {
          toast.error(
            'Ocurrió un error en el formulario de pago. Intenta de nuevo.',
          )
        },
        onSubmit: async (formData, additionalData) => {
          try {
            const result = await processMercadoPagoPayment(props.orderId, {
              paymentChannel: 'card',
              token: formData.token,
              paymentMethodId: formData.payment_method_id,
              paymentMethodType: additionalData?.paymentTypeId,
              installments: formData.installments || 1,
              payerEmail: mpPayerEmail.value,
              payerIdentification: formData.payer.identification,
              idempotencyKey: crypto.randomUUID(),
            })

            if (result.approved) {
              toast.success('Pago aprobado')
              emit('success', result.orderNumber)
              return
            }

            if (result.pending) {
              toast.info('Tu pago está en proceso de confirmación.')
              emit('pending', result.orderNumber)
              return
            }

            const message =
              result.statusDetail ??
              'No pudimos procesar el pago. Verifica los datos e intenta de nuevo.'
            emit('error', message)
            toast.error(message)
            return
          } catch (error) {
            const message = useApiErrorMessage(error)
            emit('error', message)
            toast.error(message)
          }
        },
      },
    })
  } catch (error) {
    initError.value = useApiErrorMessage(error)
  }
}

onMounted(() => {
  void initCardForm()
})

onBeforeUnmount(() => {
  cardFormController?.unmount()
  cardFormController = null
})
</script>

<template>
  <div class="space-y-4">
    <StoreMercadoPagoPayerEmailNotice
      :payer-email="payerEmail"
      :is-test-mode="isTestMode"
    />

    <p class="text-theme-muted text-sm">
      Paga con tarjeta de crédito o débito mediante Checkout API de Mercado Pago
      (formulario seguro en tu tienda, sin redirección).
    </p>

    <UiErrorState
      v-if="initError"
      title="No pudimos cargar el formulario de pago"
      :description="initError"
      @retry="initCardForm"
    />

    <div v-else class="space-y-3">
      <div v-if="!ready" class="py-6">
        <UiSkeleton tone="store" height="16rem" rounded="lg" />
      </div>
      <div :id="containerId" :class="{ 'opacity-0': !ready }" />
    </div>
  </div>
</template>
