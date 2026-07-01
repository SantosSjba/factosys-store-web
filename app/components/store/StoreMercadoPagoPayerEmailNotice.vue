<script setup lang="ts">
import { resolveMercadoPagoPayerEmail } from '~/utils/mercadopago-sandbox'
import type { MercadoPagoSandboxPayerEmailMode } from '~/types/store-checkout'

const props = defineProps<{
  orderId: string
  payerEmail: string
  isTestMode?: boolean
  sandboxPayerEmailMode?: MercadoPagoSandboxPayerEmailMode
}>()

const mode = computed(
  () => props.sandboxPayerEmailMode ?? ('testuser' as const),
)

const paymentEmail = computed(() =>
  resolveMercadoPagoPayerEmail(
    props.orderId,
    props.payerEmail,
    props.isTestMode,
    mode.value,
  ),
)
</script>

<template>
  <div
    class="rounded-xl border px-4 py-3 text-sm"
    :class="
      isTestMode
        ? 'border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-100'
        : 'border-theme bg-theme-muted/5'
    "
  >
    <p class="font-medium">Correo para procesar el pago</p>
    <p class="mt-1 font-mono text-base font-semibold">{{ paymentEmail }}</p>
    <p v-if="isTestMode && mode === 'synthetic'" class="mt-2 text-xs leading-relaxed">
      Generado automáticamente para este pedido según el formato de comprador de
      prueba que exige Mercado Pago. No lo escribas manualmente.
    </p>
    <p v-else-if="isTestMode && mode === 'order'" class="mt-2 text-xs leading-relaxed">
      Usamos el correo del pedido (no <code>test@testuser.com</code>).
    </p>
    <p v-else-if="isTestMode" class="mt-2 text-xs leading-relaxed">
      Mercado Pago oculta el campo de correo en el formulario porque ya lo
      enviamos automáticamente.
    </p>
    <p v-else class="text-theme-muted mt-2 text-xs leading-relaxed">
      Si el formulario de tarjeta muestra correo, usa este mismo valor.
    </p>
  </div>
</template>
