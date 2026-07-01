<script setup lang="ts">
import { useMercadoPagoPaymentContextQuery } from '~/composables/queries/useMercadoPagoPaymentContextQuery'
import { storeQueryKeys } from '~/constants/query-keys'

definePageMeta({
  middleware: 'store-access',
})

const route = useRoute()
const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()
const queryClient = useQueryClient()

const orderId = computed(() => String(route.params.id ?? ''))
const guestEmailInput = ref(String(route.query.email ?? '').trim())
const guestEmailConfirmed = ref(
  authStore.isAuthenticated || Boolean(guestEmailInput.value),
)

const contextGuestEmail = computed(() => {
  if (authStore.isAuthenticated) return undefined
  if (!guestEmailConfirmed.value) return undefined
  return guestEmailInput.value.trim() || undefined
})

const {
  data: paymentContext,
  isPending: contextLoading,
  isError: contextError,
  error: contextErrorData,
  refetch: refetchContext,
} = useMercadoPagoPaymentContextQuery(orderId, contextGuestEmail)

useQueryErrorToast(contextError, contextErrorData)

const contextErrorMessage = computed(() =>
  contextErrorData.value ? useApiErrorMessage(contextErrorData.value) : '',
)

const payerEmail = computed(() => paymentContext.value?.payerEmail ?? '')
const orderNumber = computed(() => paymentContext.value?.orderNumber ?? '')
const amount = computed(() => paymentContext.value?.total ?? 0)

const { data: checkoutSettings } = useStoreCheckoutSettingsQuery()
const mercadoPagoAcceptedMethods = computed(
  () => checkoutSettings.value?.payments.gateway.acceptedMethods ?? [],
)
const { data: mpConfig, isPending: mpLoading } = useMercadoPagoConfigQuery()
const mpEnabled = computed(() => mpConfig.value?.enabled === true)

const { data: paymentMethods, isPending: methodsLoading } =
  useMercadoPagoPaymentMethodsQuery(mpEnabled)

const pageLoading = computed(
  () => contextLoading.value || mpLoading.value || methodsLoading.value,
)

const canPay = computed(
  () =>
    Boolean(
      paymentContext.value?.canPay &&
        mpConfig.value?.enabled &&
        mpConfig.value.publicKey &&
        payerEmail.value &&
        amount.value > 0 &&
        orderId.value &&
        (paymentMethods.value?.methods.length ?? 0) > 0,
    ),
)

function confirmGuestEmail() {
  const email = guestEmailInput.value.trim()
  if (!email) {
    toast.error('Ingresa el correo con el que realizaste el pedido.')
    return
  }
  guestEmailConfirmed.value = true
}

function invalidateOrderQueries() {
  void queryClient.invalidateQueries({ queryKey: storeQueryKeys.orders() })
  void queryClient.invalidateQueries({ queryKey: storeQueryKeys.order(orderId.value) })
}

function onPaymentSuccess(paidOrderNumber: string) {
  invalidateOrderQueries()
  void router.push({
    path: '/checkout/gracias',
    query: { order: paidOrderNumber, paid: '1' },
  })
}

function onPaymentPending(pendingOrderNumber: string) {
  invalidateOrderQueries()
  void router.push({
    path: '/checkout/gracias',
    query: { order: pendingOrderNumber, pending: '1' },
  })
}

watch(
  paymentContext,
  (context) => {
    if (context?.paymentStatus === 'PAID') {
      void router.replace({
        path: '/checkout/gracias',
        query: { order: context.orderNumber, paid: '1' },
      })
    }
  },
  { immediate: true },
)

useStoreSeo({
  title: 'Pagar pedido',
  noindex: true,
})
</script>

<template>
  <section class="mx-auto max-w-2xl px-4 py-8 sm:py-12">
    <UiPageHeader
      title="Pagar con Mercado Pago"
      description="Checkout API: paga con tarjeta o Yape sin salir de la tienda."
      :breadcrumb="[
        { label: 'Inicio', to: '/' },
        { label: 'Checkout', to: '/checkout' },
        { label: 'Pago' },
      ]"
    />

    <div
      v-if="!authStore.isAuthenticated && !guestEmailConfirmed"
      class="border-theme bg-theme-surface space-y-4 rounded-2xl border p-6 shadow-sm"
    >
      <p class="text-theme-muted text-sm">
        Ingresa el correo con el que realizaste el pedido para continuar con el
        pago.
      </p>
      <form class="space-y-3" @submit.prevent="confirmGuestEmail">
        <UiInput
          v-model="guestEmailInput"
          label="Correo del pedido"
          type="email"
          autocomplete="email"
          placeholder="tu@correo.com"
        />
        <UiButton type="submit" icon="lucide:arrow-right" class="w-full sm:w-auto">
          Continuar al pago
        </UiButton>
      </form>
    </div>

    <div
      v-else-if="pageLoading"
      class="border-theme bg-theme-surface rounded-2xl border p-6 shadow-sm"
    >
      <UiSkeleton tone="store" height="18rem" rounded="lg" />
    </div>

    <UiErrorState
      v-else-if="contextError"
      title="No pudimos cargar el pedido"
      :description="contextErrorMessage"
      @retry="refetchContext()"
    />

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

      <StoreMercadoPagoTestModeHelp
        v-if="mpConfig?.enabled && mpConfig.isTestMode"
      />

      <StoreMercadoPagoAcceptedBadges
        v-if="mercadoPagoAcceptedMethods.length"
        :methods="mercadoPagoAcceptedMethods"
      />

      <StoreMercadoPagoCheckout
        v-if="canPay && mpConfig?.enabled"
        :order-id="orderId"
        :amount="amount"
        :payer-email="payerEmail"
        :public-key="mpConfig.publicKey"
        :is-test-mode="mpConfig.isTestMode"
        :methods="paymentMethods?.methods ?? []"
        @success="onPaymentSuccess"
        @pending="onPaymentPending"
      />

      <p v-else-if="paymentContext && !paymentContext.canPay" class="text-theme-muted text-sm">
        Este pedido no está disponible para pago en línea o ya fue pagado.
      </p>

      <p v-else class="text-theme-muted text-sm">
        Mercado Pago no está habilitado o faltan datos del pedido.
      </p>
    </div>
  </section>
</template>
