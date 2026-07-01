<script setup lang="ts">
import {
  MERCADOPAGO_SANDBOX_PAYER_EMAIL,
  resolveMercadoPagoPayerEmail,
} from '~/utils/mercadopago-sandbox'

const props = defineProps<{
  payerEmail: string
  isTestMode?: boolean
}>()

const paymentEmail = computed(() =>
  resolveMercadoPagoPayerEmail(props.payerEmail, props.isTestMode),
)
</script>

<template>
  <div class="border-theme bg-theme-muted/5 rounded-xl border px-4 py-3 text-sm">
    <p class="text-theme-muted">Correo para procesar el pago</p>
    <p class="text-theme mt-1 font-medium">{{ paymentEmail }}</p>
    <p v-if="isTestMode" class="text-theme-muted mt-2 text-xs leading-relaxed">
      En modo prueba Mercado Pago solo acepta
      <strong>{{ MERCADOPAGO_SANDBOX_PAYER_EMAIL }}</strong>. Lo enviamos
      automáticamente al formulario de tarjeta; no uses tu correo personal ahí.
    </p>
    <p v-else class="text-theme-muted mt-2 text-xs leading-relaxed">
      Usa el mismo correo de tu pedido si el formulario de tarjeta lo solicita.
    </p>
  </div>
</template>
