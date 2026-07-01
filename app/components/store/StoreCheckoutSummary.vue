<script setup lang="ts">
import type { StoreCheckoutQuote } from '~/types/store-checkout'

const props = defineProps<{
  quote: StoreCheckoutQuote | null
  quoting?: boolean
  placing?: boolean
  canSubmit?: boolean
  submitError?: string
}>()

const emit = defineEmits<{
  submit: []
}>()
</script>

<template>
  <aside
    class="border-theme bg-theme-surface space-y-4 rounded-2xl border p-5 shadow-sm lg:sticky lg:top-24"
  >
    <h2 class="text-theme text-lg font-semibold">Resumen del pedido</h2>

    <div v-if="quoting && !quote" class="space-y-2">
      <UiSkeleton tone="store" height="1rem" />
      <UiSkeleton tone="store" height="1rem" width="70%" />
      <UiSkeleton tone="store" height="1rem" width="55%" />
    </div>

    <template v-else-if="quote">
      <ul class="divide-y divide-[var(--color-border)] text-sm">
        <li
          v-for="line in quote.lines"
          :key="line.variantId"
          class="flex items-start justify-between gap-3 py-3 first:pt-0"
        >
          <div class="min-w-0">
            <p class="text-theme font-medium">{{ line.productName }}</p>
            <p v-if="line.variantName" class="text-theme-muted text-xs">
              {{ line.variantName }}
            </p>
            <p class="text-theme-muted mt-0.5 text-xs">Cantidad: {{ line.quantity }}</p>
          </div>
          <p class="text-theme shrink-0 font-medium">
            <UiPrice :price="line.lineSubtotal" :currency="quote.currencyCode" />
          </p>
        </li>
      </ul>

      <dl class="text-theme border-theme space-y-2 border-t pt-4 text-sm">
        <div class="flex items-center justify-between gap-3">
          <dt class="text-theme-muted">Subtotal</dt>
          <dd>
            <UiPrice :price="quote.subtotal" :currency="quote.currencyCode" />
          </dd>
        </div>
        <div
          v-if="quote.taxAmount > 0"
          class="flex items-center justify-between gap-3"
        >
          <dt class="text-theme-muted">IGV / impuestos</dt>
          <dd>
            <UiPrice :price="quote.taxAmount" :currency="quote.currencyCode" />
          </dd>
        </div>
        <div class="flex items-center justify-between gap-3">
          <dt class="text-theme-muted">
            Envío
            <span
              v-if="quote.shippingZoneName"
              class="text-theme-muted block text-xs"
            >
              {{ quote.shippingZoneName }}
            </span>
          </dt>
          <dd>
            <span
              v-if="quote.deliveryMethod === 'PICKUP'"
              class="text-theme-muted text-xs"
            >
              Recojo gratis
            </span>
            <span
              v-else-if="quote.isFreeShipping"
              class="text-emerald-600 text-xs font-medium"
            >
              Gratis
            </span>
            <UiPrice
              v-else
              :price="quote.shippingAmount"
              :currency="quote.currencyCode"
            />
          </dd>
        </div>
        <div
          v-if="quote.discountAmount > 0"
          class="flex items-center justify-between gap-3 text-emerald-700"
        >
          <dt>Descuento</dt>
          <dd>
            −
            <UiPrice
              :price="quote.discountAmount"
              :currency="quote.currencyCode"
            />
          </dd>
        </div>
      </dl>

      <div
        v-if="quote.stockIssues.length > 0"
        class="rounded-lg border border-amber-300/80 bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:border-amber-700/60 dark:bg-amber-950/40 dark:text-amber-100"
      >
        <p class="font-medium">Ajusta el stock antes de continuar:</p>
        <ul class="mt-1 list-disc space-y-0.5 pl-4">
          <li v-for="issue in quote.stockIssues" :key="issue.variantId">
            {{ issue.productName }}
            <template v-if="issue.variantName"> — {{ issue.variantName }}</template>
            : solo {{ issue.availableQuantity }} disponible(s)
          </li>
        </ul>
      </div>

      <div class="border-theme space-y-3 border-t pt-4">
        <div class="flex items-center justify-between gap-3">
          <span class="text-theme font-semibold">Total</span>
          <UiPrice
            :price="quote.total"
            :currency="quote.currencyCode"
            class="text-lg font-bold"
          />
        </div>

        <p v-if="submitError" class="text-xs text-red-600">{{ submitError }}</p>

        <UiButton
          icon="lucide:check-circle"
          class="w-full"
          :loading="placing"
          :disabled="!canSubmit || !quote.canPlaceOrder"
          @click="emit('submit')"
        >
          Confirmar pedido
        </UiButton>

        <NuxtLink to="/carrito" class="block">
          <UiButton variant="ghost" icon="lucide:arrow-left" class="w-full">
            Volver al carrito
          </UiButton>
        </NuxtLink>
      </div>
    </template>

    <div
      v-else-if="!quoting"
      class="bg-theme-muted/50 text-theme-muted rounded-xl px-4 py-3 text-sm leading-relaxed"
    >
      Completa los datos de entrega (distrito, provincia y departamento) para
      ver el resumen y el total de tu pedido.
    </div>
  </aside>
</template>
