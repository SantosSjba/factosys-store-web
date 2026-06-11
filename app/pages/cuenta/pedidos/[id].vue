<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const route = useRoute()
const orderId = computed(() => String(route.params.id ?? ''))

const {
  data: order,
  isPending,
  isError,
  error,
  refetch,
} = useStoreOrderQuery(orderId)

useQueryErrorToast(isError, error)

const shippingAddress = computed(() =>
  order.value?.addresses.find((address) => address.type === 'SHIPPING') ?? null,
)

const caption = computed(() =>
  order.value ? formatOrderDeliveryCaption(order.value) : '',
)

useStoreSeo(
  computed(() => ({
    title: order.value ? `Pedido ${order.value.orderNumber}` : 'Detalle de pedido',
    noindex: true,
  })),
)
</script>

<template>
  <section class="mx-auto max-w-5xl px-4 py-8 sm:py-12">
    <UiPageHeader
      :title="order ? `Pedido ${order.orderNumber}` : 'Detalle de pedido'"
      :description="caption"
      :breadcrumb="[
        { label: 'Inicio', to: '/' },
        { label: 'Mi cuenta', to: '/cuenta?tab=compras' },
        { label: order?.orderNumber ?? 'Pedido' },
      ]"
    />

    <div
      v-if="isPending"
      class="border-theme bg-theme-surface space-y-4 rounded-2xl border p-6 shadow-sm"
    >
      <UiSkeleton tone="store" height="1.5rem" width="40%" />
      <UiSkeleton tone="store" height="4rem" />
      <UiSkeleton tone="store" height="8rem" />
    </div>

    <UiErrorState
      v-else-if="isError"
      title="No pudimos cargar tu pedido"
      @retry="refetch()"
    />

    <div
      v-else-if="order"
      class="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]"
    >
      <div class="space-y-6">
        <div class="border-theme bg-theme-surface rounded-2xl border p-5 shadow-sm sm:p-6">
          <h2 class="text-theme text-lg font-bold">Productos</h2>
          <ul class="mt-4 divide-y divide-[var(--color-border)]">
            <li
              v-for="item in order.items"
              :key="item.id"
              class="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0"
            >
              <div class="min-w-0">
                <p class="text-theme font-medium">{{ item.productName }}</p>
                <p v-if="item.variantName" class="text-theme-muted text-sm">
                  {{ item.variantName }}
                </p>
                <p class="text-theme-muted mt-1 text-sm">
                  Cantidad: {{ item.quantity }}
                </p>
              </div>
              <p class="text-theme shrink-0 font-semibold">
                {{ formatPrice(item.lineTotal, order.currencyCode) }}
              </p>
            </li>
          </ul>

          <div class="border-theme text-theme-muted mt-5 space-y-2 border-t pt-5 text-sm">
            <div class="flex justify-between">
              <span>Subtotal</span>
              <span>{{ formatPrice(order.subtotal, order.currencyCode) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Envío</span>
              <span>{{ formatPrice(order.shippingAmount, order.currencyCode) }}</span>
            </div>
            <div
              v-if="Number(order.discountAmount) > 0"
              class="flex justify-between"
            >
              <span>Descuento</span>
              <span>-{{ formatPrice(order.discountAmount, order.currencyCode) }}</span>
            </div>
            <div class="text-theme flex justify-between text-base font-semibold">
              <span>Total</span>
              <span>{{ formatPrice(order.total, order.currencyCode) }}</span>
            </div>
          </div>
        </div>

        <div class="border-theme bg-theme-surface rounded-2xl border p-5 shadow-sm sm:p-6">
          <StoreOrderTimeline :history="order.statusHistory" />
        </div>
      </div>

      <aside class="space-y-6">
        <div class="border-theme bg-theme-surface rounded-2xl border p-5 shadow-sm sm:p-6">
          <div class="flex flex-wrap items-center gap-2">
            <UiBadge :variant="orderStatusVariant(order.status)" class="normal-case">
              {{ formatOrderStatus(order.status) }}
            </UiBadge>
            <UiBadge :variant="paymentStatusVariant(order.paymentStatus)" class="normal-case">
              {{ formatPaymentStatus(order.paymentStatus) }}
            </UiBadge>
          </div>

          <div class="mt-5 space-y-4 text-sm">
            <div>
              <p class="text-theme-muted text-xs font-medium uppercase tracking-wide">
                Total pagado
              </p>
              <p class="text-theme mt-1 text-2xl font-bold">
                {{ formatPrice(order.total, order.currencyCode) }}
              </p>
            </div>
            <div>
              <p class="text-theme-muted text-xs font-medium uppercase tracking-wide">
                Fecha de compra
              </p>
              <p class="text-theme mt-1">{{ formatStoreDate(order.createdAt) }}</p>
            </div>
            <div>
              <p class="text-theme-muted text-xs font-medium uppercase tracking-wide">
                Entrega
              </p>
              <p class="text-theme mt-1">{{ formatDeliveryMethod(order.deliveryMethod) }}</p>
            </div>
            <div v-if="order.paymentMethod">
              <p class="text-theme-muted text-xs font-medium uppercase tracking-wide">
                Método de pago
              </p>
              <p class="text-theme mt-1">{{ formatPaymentMethod(order.paymentMethod) }}</p>
            </div>
          </div>

          <div
            v-if="order.trackingNumber || order.trackingUrl"
            class="border-theme bg-theme-muted/60 mt-5 rounded-xl border p-4"
          >
            <p class="text-theme text-sm font-semibold">Seguimiento</p>
            <p v-if="order.carrier" class="text-theme-muted mt-1 text-sm">
              Transportista: {{ order.carrier }}
            </p>
            <p v-if="order.trackingNumber" class="text-theme-muted mt-1 text-sm">
              Guía: {{ order.trackingNumber }}
            </p>
            <a
              v-if="order.trackingUrl"
              :href="order.trackingUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="text-brand-accent-deep mt-2 inline-flex text-sm font-medium hover:underline"
            >
              Rastrear envío →
            </a>
          </div>
        </div>

        <div
          v-if="shippingAddress"
          class="border-theme bg-theme-surface rounded-2xl border p-5 shadow-sm sm:p-6"
        >
          <h2 class="text-theme text-base font-bold">Dirección de envío</h2>
          <p class="text-theme mt-3 text-sm leading-relaxed">
            {{ shippingAddress.addressLine1 }}
            <span v-if="shippingAddress.addressLine2">, {{ shippingAddress.addressLine2 }}</span>
            <br>
            <span v-if="shippingAddress.district">{{ shippingAddress.district }}, </span>
            <span v-if="shippingAddress.province">{{ shippingAddress.province }}</span>
            <span v-if="shippingAddress.department"> · {{ shippingAddress.department }}</span>
          </p>
        </div>

        <NuxtLink to="/cuenta?tab=compras">
          <UiButton variant="secondary" class="w-full">
            Volver a mis compras
          </UiButton>
        </NuxtLink>
      </aside>
    </div>
  </section>
</template>
