<script setup lang="ts">
import type { StoreCart } from '~/types/store-cart'

const props = defineProps<{
  cart: StoreCart
  clearing?: boolean
}>()

const emit = defineEmits<{
  clear: []
}>()

const { data: settings } = useStoreSettingsQuery()

const currencyCode = computed(() => props.cart.currencyCode ?? 'PEN')

const freeShippingHint = computed(() => {
  const min = settings.value?.freeShippingMinAmount
  if (!min || Number.parseFloat(min) <= 0) return null

  const symbol = settings.value?.currency.symbol ?? 'S/'
  const remaining = Number.parseFloat(min) - props.cart.subtotal

  if (remaining <= 0) {
    return '¡Tu pedido califica para envío gratis!'
  }

  return `Agrega ${symbol} ${remaining.toFixed(2)} más para envío gratis`
})
</script>

<template>
  <aside
    class="border-theme bg-theme-surface space-y-4 rounded-2xl border p-5 shadow-sm lg:sticky lg:top-24"
  >
    <h2 class="text-theme text-lg font-semibold">Resumen</h2>

    <dl class="text-theme space-y-2 text-sm">
      <div class="flex items-center justify-between gap-3">
        <dt class="text-theme-muted">
          Productos ({{ cart.itemCount }})
        </dt>
        <dd class="font-medium">
          <UiPrice :price="cart.subtotal" :currency="currencyCode" />
        </dd>
      </div>
      <div class="flex items-center justify-between gap-3">
        <dt class="text-theme-muted">Envío</dt>
        <dd class="text-theme-muted text-xs">Se calcula al pagar</dd>
      </div>
    </dl>

    <p
      v-if="freeShippingHint"
      class="bg-theme-muted/60 text-theme rounded-lg px-3 py-2 text-xs leading-relaxed"
    >
      {{ freeShippingHint }}
    </p>

    <div class="border-theme space-y-3 border-t pt-4">
      <div class="flex items-center justify-between gap-3">
        <span class="text-theme font-semibold">Subtotal</span>
        <UiPrice
          :price="cart.subtotal"
          :currency="currencyCode"
          class="text-lg font-bold"
        />
      </div>

      <NuxtLink to="/checkout" class="block">
        <UiButton icon="lucide:credit-card" class="w-full">
          Ir a pagar
        </UiButton>
      </NuxtLink>

      <UiButton
        variant="secondary"
        icon="lucide:trash-2"
        class="w-full"
        :loading="clearing"
        :disabled="cart.items.length === 0"
        @click="emit('clear')"
      >
        Vaciar carrito
      </UiButton>

      <NuxtLink to="/productos" class="block">
        <UiButton variant="ghost" icon="lucide:store" class="w-full">
          Seguir comprando
        </UiButton>
      </NuxtLink>
    </div>
  </aside>
</template>
