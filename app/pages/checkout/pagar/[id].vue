<script setup lang="ts">
definePageMeta({
  middleware: 'store-access',
})

const route = useRoute()
const router = useRouter()
const toast = useToast()

const orderId = computed(() => String(route.params.id ?? ''))
const payerEmail = computed(() => String(route.query.email ?? '').trim())
const orderNumber = computed(() => String(route.query.order ?? '').trim())
const amount = computed(() => Number(route.query.total ?? 0))

const { data: mpConfig, isPending: mpLoading } = useMercadoPagoConfigQuery()
const mpEnabled = computed(() => mpConfig.value?.enabled === true)

const { data: paymentMethods, isPending: methodsLoading } =
  useMercadoPagoPaymentMethodsQuery(mpEnabled)

const canPay = computed(
  () =>
    Boolean(
      mpConfig.value?.enabled &&
        mpConfig.value.publicKey &&
        payerEmail.value &&
        amount.value > 0 &&
        orderId.value &&
        (paymentMethods.value?.methods.length ?? 0) > 0,
    ),
)

function onPaymentSuccess(paidOrderNumber: string) {
  void router.push({
    path: '/checkout/gracias',
    query: { order: paidOrderNumber, paid: '1' },
  })
}

onMounted(() => {
  if (!payerEmail.value || !amount.value) {
    toast.error('Faltan datos para iniciar el pago.')
    void router.replace('/checkout')
  }
})

useStoreSeo({
  title: 'Pagar pedido',
  noindex: true,
})
</script>

<template>
  <section class="mx-auto max-w-2xl px-4 py-8 sm:py-12">
    <UiPageHeader
      title="Pagar con Mercado Pago"
      description="Elige tu medio de pago y completa el pedido de forma segura."
      :breadcrumb="[
        { label: 'Inicio', to: '/' },
        { label: 'Checkout', to: '/checkout' },
        { label: 'Pago' },
      ]"
    />

    <div
      v-if="mpLoading || methodsLoading"
      class="border-theme bg-theme-surface rounded-2xl border p-6 shadow-sm"
    >
      <UiSkeleton tone="store" height="18rem" rounded="lg" />
    </div>

    <div
      v-else
      class="border-theme bg-theme-surface space-y-6 rounded-2xl border p-6 shadow-sm"
    >
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p class="text-theme-muted text-sm">Pedido</p>
          <p class="text-theme text-lg font-semibold">
            {{ orderNumber || orderId }}
          </p>
        </div>
        <div class="text-right">
          <p class="text-theme-muted text-sm">Total</p>
          <p class="text-theme text-lg font-semibold">
            S/ {{ amount.toFixed(2) }}
          </p>
        </div>
      </div>

      <StoreMercadoPagoCheckout
        v-if="canPay && mpConfig?.enabled"
        :order-id="orderId"
        :amount="amount"
        :payer-email="payerEmail"
        :public-key="mpConfig.publicKey"
        :is-test-mode="mpConfig.isTestMode"
        :methods="paymentMethods?.methods ?? []"
        @success="onPaymentSuccess"
      />

      <p v-else class="text-theme-muted text-sm">
        Mercado Pago no está habilitado o faltan datos del pedido.
      </p>
    </div>
  </section>
</template>
