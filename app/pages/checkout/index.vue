<script setup lang="ts">
import { PERU_DEPARTMENTS } from '~/constants/peru-departments'
import type { OrderDeliveryMethod, OrderPaymentMethod } from '~/types/admin-orders'
import type { CustomerSavedAddress } from '~/types/admin-customers'
import type { StoreCheckoutQuote } from '~/types/store-checkout'

definePageMeta({
  middleware: 'store-access',
})

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()
const isGuestCheckout = computed(() => !authStore.isAuthenticated)
const guestCart = useGuestCartToken()

const guestEmail = ref('')
const guestFirstName = ref('')
const guestLastName = ref('')
const guestPhone = ref('')

const { data: cart, isPending: cartPending } = useStoreCartQuery()
const { data: checkoutSettings, isPending: settingsPending } =
  useStoreCheckoutSettingsQuery()
const { data: profile } = useStoreProfileQuery()
const { data: savedAddresses } = useStoreAddressesQuery()

const quoteMutation = useStoreCheckoutQuoteMutation()
const placeOrderMutation = useStorePlaceOrderMutation()

const deliveryMethod = ref<OrderDeliveryMethod>('SHIPPING')
const paymentMethod = ref<OrderPaymentMethod>('BANK_TRANSFER')
const couponCode = ref('')
const customerNotes = ref('')
const submitError = ref('')

const addressLine1 = ref('')
const addressLine2 = ref('')
const district = ref('')
const province = ref('')
const department = ref('Lima')
const phone = ref('')
const firstName = ref('')
const lastName = ref('')
const selectedSavedAddressId = ref('')

const departmentOptions = PERU_DEPARTMENTS.map((value) => ({
  label: value,
  value,
}))

const deliveryOptions = [
  { label: 'Envío a domicilio', value: 'SHIPPING' },
  { label: 'Recojo en tienda', value: 'PICKUP' },
]

const paymentOptions = computed(() => {
  const payments = checkoutSettings.value?.payments
  if (!payments) return []

  const options: Array<{ label: string; value: OrderPaymentMethod }> = []

  if (payments.cash) {
    options.push({
      label: deliveryMethod.value === 'PICKUP' ? 'Efectivo en tienda' : 'Contra entrega',
      value: 'CASH',
    })
  }
  if (payments.bankTransfer.enabled) {
    options.push({ label: 'Transferencia bancaria', value: 'BANK_TRANSFER' })
  }
  if (payments.yape.enabled) {
    options.push({ label: 'Yape', value: 'YAPE' })
  }
  if (payments.plin.enabled) {
    options.push({ label: 'Plin', value: 'PLIN' })
  }

  return options
})

const quoteParams = computed(() => {
  if (!cart.value?.items.length) return null

  return {
    deliveryMethod: deliveryMethod.value,
    department:
      deliveryMethod.value === 'SHIPPING' ? department.value : undefined,
    province:
      deliveryMethod.value === 'SHIPPING' ? province.value : undefined,
    couponCode: couponCode.value.trim() || undefined,
  }
})

const canRequestQuote = computed(() => {
  if (!quoteParams.value) return false
  if (quoteParams.value.deliveryMethod === 'PICKUP') return true
  return Boolean(department.value.trim() && province.value.trim())
})

const quote = ref<StoreCheckoutQuote | null>(null)
let quoteTimer: ReturnType<typeof setTimeout> | undefined

async function refreshQuote() {
  if (!canRequestQuote.value || !quoteParams.value) {
    quote.value = null
    return
  }

  try {
    quote.value = await quoteMutation.mutateAsync(quoteParams.value)
  } catch (error) {
    quote.value = null
    toast.error(useApiErrorMessage(error))
  }
}

function scheduleQuoteRefresh() {
  clearTimeout(quoteTimer)
  quoteTimer = setTimeout(() => {
    void refreshQuote()
  }, 350)
}

watch(
  [quoteParams, canRequestQuote],
  () => {
    if (canRequestQuote.value) {
      scheduleQuoteRefresh()
    } else {
      quote.value = null
    }
  },
  { deep: true, immediate: true },
)

watch(paymentOptions, (options) => {
  if (!options.some((option) => option.value === paymentMethod.value)) {
    paymentMethod.value = options[0]?.value ?? 'BANK_TRANSFER'
  }
})

watch(
  profile,
  (value) => {
    if (!value) return
    if (!firstName.value) firstName.value = value.firstName ?? ''
    if (!lastName.value) lastName.value = value.lastName ?? ''
    if (!phone.value) phone.value = value.phone ?? ''
  },
  { immediate: true },
)

watch(cart, (value) => {
  if (!cartPending.value && value && value.items.length === 0) {
    void router.replace('/carrito')
  }
})

function applySavedAddress(address: CustomerSavedAddress) {
  selectedSavedAddressId.value = address.id
  addressLine1.value = address.addressLine1
  addressLine2.value = address.addressLine2 ?? ''
  district.value = address.district ?? ''
  province.value = address.province ?? ''
  department.value = address.department ?? 'Lima'
  phone.value = address.phone ?? phone.value
  firstName.value = address.firstName ?? firstName.value
  lastName.value = address.lastName ?? lastName.value
}

const paymentInstructions = computed(() => {
  const payments = checkoutSettings.value?.payments
  if (!payments) return null

  if (paymentMethod.value === 'BANK_TRANSFER') {
    return payments.bankTransfer.instructions
  }
  if (paymentMethod.value === 'YAPE' && payments.yape.number) {
    return `Número Yape: ${payments.yape.number}`
  }
  if (paymentMethod.value === 'PLIN' && payments.plin.number) {
    return `Número Plin: ${payments.plin.number}`
  }
  return null
})

const pickupPoint = computed(() => checkoutSettings.value?.pickup)

const canSubmit = computed(() => {
  if (!quote.value?.canPlaceOrder) return false

  if (isGuestCheckout.value && !guestEmail.value.trim()) {
    return false
  }

  if (deliveryMethod.value === 'PICKUP') {
    return Boolean(paymentMethod.value)
  }

  return Boolean(
    addressLine1.value.trim() &&
      district.value.trim() &&
      province.value.trim() &&
      department.value.trim() &&
      paymentMethod.value,
  )
})

onMounted(() => {
  if (isGuestCheckout.value && checkoutSettings.value?.guestCheckoutEnabled) {
    guestCart.ensure()
  }
})

async function onSubmit() {
  submitError.value = ''

  if (!canSubmit.value || !quoteParams.value) {
    submitError.value = 'Completa los datos requeridos.'
    return
  }

  try {
    if (!isGuestCheckout.value) {
      await authStore.ensureFreshAccessToken()
    } else {
      guestCart.ensure()
    }

    const contactFirstName = isGuestCheckout.value
      ? guestFirstName.value
      : firstName.value
    const contactLastName = isGuestCheckout.value
      ? guestLastName.value
      : lastName.value
    const contactPhone = isGuestCheckout.value ? guestPhone.value : phone.value

    const order = await placeOrderMutation.mutateAsync({
      ...quoteParams.value,
      paymentMethod: paymentMethod.value,
      customerNotes: customerNotes.value.trim() || undefined,
      guestContact: isGuestCheckout.value
        ? {
            email: guestEmail.value.trim(),
            firstName: guestFirstName.value.trim() || undefined,
            lastName: guestLastName.value.trim() || undefined,
            phone: guestPhone.value.trim() || undefined,
          }
        : undefined,
      shippingAddress:
        deliveryMethod.value === 'SHIPPING'
          ? {
              firstName: contactFirstName.trim() || undefined,
              lastName: contactLastName.trim() || undefined,
              phone: contactPhone.trim() || undefined,
              addressLine1: addressLine1.value.trim(),
              addressLine2: addressLine2.value.trim() || undefined,
              district: district.value.trim(),
              province: province.value.trim(),
              department: department.value.trim(),
              country: 'PE',
            }
          : undefined,
    })

    toast.success(`Pedido ${order.orderNumber} registrado correctamente.`)

    if (isGuestCheckout.value) {
      guestCart.clear()
      await router.push({
        path: '/checkout/gracias',
        query: { order: order.orderNumber },
      })
      return
    }

    await router.push(`/cuenta/pedidos/${order.id}`)
  } catch (error) {
    submitError.value = useApiErrorMessage(error)
  }
}

useStoreSeo({
  title: 'Checkout',
  noindex: true,
})
</script>

<template>
  <section class="mx-auto max-w-7xl px-4 py-8 sm:py-12">
    <UiPageHeader
      title="Finalizar compra"
      description="Elige cómo recibir tu pedido y confirma el pago."
      :breadcrumb="[
        { label: 'Inicio', to: '/' },
        { label: 'Carrito', to: '/carrito' },
        { label: 'Checkout' },
      ]"
    />

    <div
      v-if="cartPending || settingsPending"
      class="grid gap-8 lg:grid-cols-[1fr_minmax(18rem,22rem)]"
    >
      <UiSkeleton tone="store" height="24rem" rounded="lg" />
      <UiSkeleton tone="store" height="16rem" rounded="lg" />
    </div>

    <div
      v-else-if="cart && cart.items.length > 0"
      class="grid gap-8 lg:grid-cols-[1fr_minmax(18rem,22rem)] lg:items-start"
    >
      <div class="space-y-6">
        <section
          v-if="isGuestCheckout"
          class="border-theme bg-theme-surface rounded-2xl border p-5 shadow-sm"
        >
          <h2 class="text-theme mb-1 text-lg font-semibold">Tus datos</h2>
          <p class="text-theme-muted mb-4 text-sm">
            Compra como invitado. Te enviaremos la confirmación por correo.
          </p>
          <div class="grid gap-4 sm:grid-cols-2">
            <UiInput
              v-model="guestEmail"
              label="Correo electrónico"
              type="email"
              required
              class="sm:col-span-2"
              autocomplete="email"
            />
            <UiInput
              v-model="guestFirstName"
              label="Nombres"
              autocomplete="given-name"
            />
            <UiInput
              v-model="guestLastName"
              label="Apellidos"
              autocomplete="family-name"
            />
            <UiInput
              v-model="guestPhone"
              label="Celular"
              class="sm:col-span-2"
              autocomplete="tel"
            />
          </div>
          <p class="text-theme-muted mt-3 text-xs">
            ¿Ya tienes cuenta?
            <NuxtLink to="/login" class="text-[var(--brand-cyan)] hover:underline">
              Inicia sesión
            </NuxtLink>
            para ver tus pedidos en un solo lugar.
          </p>
        </section>

        <section class="border-theme bg-theme-surface rounded-2xl border p-5 shadow-sm">
          <h2 class="text-theme mb-4 text-lg font-semibold">Entrega</h2>
          <UiRadioGroup
            v-model="deliveryMethod"
            :options="deliveryOptions"
            name="delivery-method"
          />

          <div
            v-if="deliveryMethod === 'PICKUP' && pickupPoint?.name"
            class="bg-theme-muted/50 text-theme mt-4 rounded-xl px-4 py-3 text-sm"
          >
            <p class="font-medium">{{ pickupPoint.name }}</p>
            <p v-if="pickupPoint.address" class="text-theme-muted mt-1">
              {{ pickupPoint.address }}
            </p>
            <p
              v-if="pickupPoint.district || pickupPoint.province"
              class="text-theme-muted mt-1"
            >
              {{
                [pickupPoint.district, pickupPoint.province, pickupPoint.department]
                  .filter(Boolean)
                  .join(', ')
              }}
            </p>
            <p v-if="pickupPoint.hours" class="text-theme-muted mt-1">
              Horario: {{ pickupPoint.hours }}
            </p>
            <p v-if="pickupPoint.phone" class="text-theme-muted mt-1">
              Tel: {{ pickupPoint.phone }}
            </p>
          </div>
        </section>

        <section
          v-if="deliveryMethod === 'SHIPPING'"
          class="border-theme bg-theme-surface rounded-2xl border p-5 shadow-sm"
        >
          <h2 class="text-theme mb-1 text-lg font-semibold">Dirección de envío</h2>
          <p class="text-theme-muted mb-4 text-sm">
            Datos según el formato de Perú: distrito, provincia y departamento.
          </p>

          <div
            v-if="!isGuestCheckout && savedAddresses?.length"
            class="mb-4 space-y-2"
          >
            <p class="text-theme text-sm font-medium">Direcciones guardadas</p>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="address in savedAddresses"
                :key="address.id"
                type="button"
                class="border-theme text-theme rounded-full border px-3 py-1.5 text-xs transition hover:border-[var(--brand-cyan)]"
                :class="
                  selectedSavedAddressId === address.id &&
                  'border-[var(--brand-cyan)] bg-[color-mix(in_srgb,var(--brand-cyan)_10%,transparent)]'
                "
                @click="applySavedAddress(address)"
              >
                {{ address.district }}, {{ address.province }}
              </button>
            </div>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <template v-if="!isGuestCheckout">
              <UiInput
                v-model="firstName"
                label="Nombres"
                autocomplete="given-name"
              />
              <UiInput
                v-model="lastName"
                label="Apellidos"
                autocomplete="family-name"
              />
              <UiInput
                v-model="phone"
                label="Celular"
                autocomplete="tel"
                class="sm:col-span-2"
                hint="9 dígitos, idealmente con código +51"
              />
            </template>
            <UiInput
              v-model="addressLine1"
              label="Dirección"
              required
              class="sm:col-span-2"
              placeholder="Av./Calle, N°, Urb."
              autocomplete="street-address"
            />
            <UiInput
              v-model="addressLine2"
              label="Referencia (opcional)"
              class="sm:col-span-2"
              placeholder="Ej. casa azul, portón negro"
            />
            <UiInput
              v-model="district"
              label="Distrito"
              required
              autocomplete="address-level3"
            />
            <UiInput
              v-model="province"
              label="Provincia"
              required
              autocomplete="address-level2"
            />
            <UiSelect
              v-model="department"
              label="Departamento"
              required
              :options="departmentOptions"
              class="sm:col-span-2"
            />
          </div>
        </section>

        <section class="border-theme bg-theme-surface rounded-2xl border p-5 shadow-sm">
          <h2 class="text-theme mb-4 text-lg font-semibold">Pago</h2>

          <UiRadioGroup
            v-if="paymentOptions.length > 0"
            v-model="paymentMethod"
            :options="paymentOptions"
            name="payment-method"
          />
          <p v-else class="text-theme-muted text-sm">
            No hay métodos de pago habilitados. Contacta a la tienda.
          </p>

          <p
            v-if="paymentInstructions"
            class="bg-theme-muted/50 text-theme-muted mt-4 rounded-xl px-4 py-3 text-sm whitespace-pre-line"
          >
            {{ paymentInstructions }}
          </p>

          <p
            v-if="paymentMethod !== 'CASH'"
            class="text-theme-muted mt-3 text-xs"
          >
            Tu pedido quedará pendiente de pago hasta que confirmemos el abono.
          </p>
        </section>

        <section class="border-theme bg-theme-surface rounded-2xl border p-5 shadow-sm">
          <h2 class="text-theme mb-4 text-lg font-semibold">Extras</h2>
          <div class="grid gap-4 sm:grid-cols-2">
            <UiInput
              v-model="couponCode"
              label="Cupón de descuento"
              placeholder="Código promocional"
            />
            <UiInput
              v-model="customerNotes"
              label="Notas del pedido"
              class="sm:col-span-2"
              placeholder="Indicaciones para la entrega"
            />
          </div>
        </section>
      </div>

      <StoreCheckoutSummary
        :quote="quote"
        :quoting="quoteMutation.isPending.value"
        :placing="placeOrderMutation.isPending.value"
        :can-submit="canSubmit"
        :submit-error="submitError"
        @submit="onSubmit"
      />
    </div>
  </section>
</template>
