<script setup lang="ts">
import { processMercadoPagoPayment } from '~/api/store-mercadopago.api'
import { getMercadoPagoClient } from '~/utils/mercadopago'
import { resolveMercadoPagoPayerEmail } from '~/utils/mercadopago-sandbox'

const props = defineProps<{
  orderId: string
  amount: number
  payerEmail: string
  publicKey: string
  maxAmount?: number
  isTestMode?: boolean
}>()

const emit = defineEmits<{
  success: [orderNumber: string]
  pending: [orderNumber: string]
  error: [message: string]
}>()

const toast = useToast()
const paying = ref(false)
const phoneNumber = ref('')
const otp = ref('')

const exceedsLimit = computed(
  () => props.maxAmount != null && props.amount > props.maxAmount,
)

async function onPay() {
  if (paying.value || exceedsLimit.value) return

  const normalizedPhone = phoneNumber.value.replace(/\D/g, '')
  const normalizedOtp = otp.value.replace(/\D/g, '')

  if (normalizedPhone.length < 9 || normalizedOtp.length !== 6) {
    toast.error('Ingresa un celular válido y el código OTP de 6 dígitos.')
    return
  }

  paying.value = true
  try {
    const mp = await getMercadoPagoClient(props.publicKey)
    const yape = mp.yape({
      phoneNumber: normalizedPhone,
      otp: normalizedOtp,
    })
    const yapeToken = await yape.create()

    const result = await processMercadoPagoPayment(props.orderId, {
      paymentChannel: 'yape',
      token: yapeToken.id,
      paymentMethodId: 'yape',
      installments: 1,
      payerEmail: resolveMercadoPagoPayerEmail(props.payerEmail, props.isTestMode),
      idempotencyKey: crypto.randomUUID(),
    })

    if (result.approved) {
      toast.success('Pago con Yape aprobado')
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
  } catch (error) {
    const message = useApiErrorMessage(error)
    emit('error', message)
    toast.error(message)
  } finally {
    paying.value = false
  }
}
</script>

<template>
  <div class="space-y-4">
    <p class="text-theme-muted text-sm">
      Paga con Yape mediante Checkout API de Mercado Pago (sin salir de la tienda).
    </p>

    <p
      v-if="isTestMode"
      class="bg-theme-muted/10 text-theme-muted rounded-xl px-3 py-2 text-xs leading-relaxed"
    >
      Modo prueba: celular <strong>111111111</strong> y OTP <strong>123456</strong>
      para simular un pago aprobado.
    </p>

    <p
      v-if="exceedsLimit"
      class="text-sm text-red-600"
    >
      El monto supera el límite permitido por Yape
      <span v-if="maxAmount">(máx. S/ {{ maxAmount.toFixed(2) }})</span>.
    </p>

    <form class="space-y-3" @submit.prevent="onPay">
      <UiInput
        v-model="phoneNumber"
        label="Celular Yape"
        type="tel"
        inputmode="numeric"
        autocomplete="tel"
        placeholder="999 999 999"
      />
      <UiInput
        v-model="otp"
        label="Código OTP"
        type="text"
        inputmode="numeric"
        maxlength="6"
        placeholder="6 dígitos"
      />

      <UiButton
        type="submit"
        icon="lucide:smartphone"
        class="w-full sm:w-auto"
        :loading="paying"
        :disabled="exceedsLimit"
      >
        Pagar con Yape
      </UiButton>
    </form>
  </div>
</template>
