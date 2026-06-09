<script setup lang="ts">
import type { OrderDetail } from '~/types/admin-orders'
import type { StoreSettings } from '~/types/admin-settings'
import {
  formatDeliveryMethod,
  formatFulfillmentStatus,
  formatOrderStatus,
  formatPaymentStatus,
} from '~/utils/format-order'
import { formatPaymentMethod } from '~/utils/format-payment-method'
import { formatPickupPointAddress } from '~/utils/format-pickup-point'

defineProps<{
  order: OrderDetail
  pickupPoint?: Pick<
    StoreSettings,
    | 'pickupPointName'
    | 'pickupPointAddress'
    | 'pickupPointDistrict'
    | 'pickupPointProvince'
    | 'pickupPointDepartment'
    | 'pickupPointHours'
    | 'pickupPointPhone'
  > | null
}>()
</script>

<template>
  <div class="print-sheet hidden print:block">
    <div class="p-8 text-sm text-black">
      <div class="mb-6 border-b border-black pb-4">
        <h1 class="text-2xl font-bold">Hoja de despacho</h1>
        <p class="mt-1 text-lg font-semibold">Pedido {{ order.orderNumber }}</p>
        <p class="mt-1">{{ formatAdminDateTime(order.createdAt) }}</p>
      </div>

      <div class="mb-6 grid grid-cols-2 gap-4">
        <div>
          <p class="font-semibold">Cliente</p>
          <p>{{ order.customerName || '—' }}</p>
          <p>{{ order.customerEmail || '—' }}</p>
          <p v-if="order.guestPhone">{{ order.guestPhone }}</p>
        </div>
        <div>
          <p class="font-semibold">Estado</p>
          <p>{{ formatOrderStatus(order.status) }}</p>
          <p>{{ formatPaymentStatus(order.paymentStatus) }}</p>
          <p>{{ formatDeliveryMethod(order.deliveryMethod) }}</p>
          <p>Despacho: {{ formatFulfillmentStatus(order.fulfillmentStatus) }}</p>
          <p v-if="order.warehouseName">Almacén: {{ order.warehouseName }}</p>
          <p v-if="order.paymentMethod">Pago: {{ formatPaymentMethod(order.paymentMethod) }}</p>
        </div>
      </div>

      <div
        v-if="order.deliveryMethod === 'SHIPPING' && (order.trackingNumber || order.carrier)"
        class="mb-4 rounded border border-gray-400 p-3"
      >
        <p class="font-semibold">Envío</p>
        <p v-if="order.carrier">Transportista: {{ order.carrier }}</p>
        <p v-if="order.trackingNumber">Tracking: {{ order.trackingNumber }}</p>
        <p v-if="order.trackingUrl" class="break-all text-xs">{{ order.trackingUrl }}</p>
        <p v-if="order.shippingNotes" class="mt-1 text-xs">Notas: {{ order.shippingNotes }}</p>
      </div>

      <table class="mb-6 w-full border-collapse text-left">
        <thead>
          <tr class="border-b border-black">
            <th class="w-8 py-2 pr-2">✓</th>
            <th class="py-2 pr-2">Producto</th>
            <th class="py-2 pr-2">SKU</th>
            <th class="py-2 pr-2 text-right">Cant.</th>
            <th class="py-2 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in order.items" :key="item.id" class="border-b border-gray-300">
            <td class="py-2 pr-2">
              <span class="inline-block h-4 w-4 border border-black" />
            </td>
            <td class="py-2 pr-2">
              {{ item.productName }}
              <span v-if="item.variantName" class="block text-xs text-gray-600">
                {{ item.variantName }}
              </span>
            </td>
            <td class="py-2 pr-2">{{ item.sku }}</td>
            <td class="py-2 pr-2 text-right font-semibold">{{ item.quantity }}</td>
            <td class="py-2 text-right">
              {{ formatPrice(item.lineTotal, order.currencyCode) }}
            </td>
          </tr>
        </tbody>
      </table>

      <div class="ml-auto max-w-xs space-y-1">
        <div class="flex justify-between">
          <span>Subtotal</span>
          <span>{{ formatPrice(order.subtotal, order.currencyCode) }}</span>
        </div>
        <div class="flex justify-between">
          <span>Impuesto</span>
          <span>{{ formatPrice(order.taxAmount, order.currencyCode) }}</span>
        </div>
        <div v-if="order.deliveryMethod === 'SHIPPING'" class="flex justify-between">
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
        <div class="flex justify-between border-t border-black pt-2 text-base font-bold">
          <span>Total</span>
          <span>{{ formatPrice(order.total, order.currencyCode) }}</span>
        </div>
      </div>

      <div
        v-if="order.deliveryMethod === 'PICKUP' && pickupPoint"
        class="mt-6"
      >
        <p class="font-semibold">Punto de recojo</p>
        <p v-if="pickupPoint.pickupPointName">{{ pickupPoint.pickupPointName }}</p>
        <p v-if="formatPickupPointAddress(pickupPoint)">
          {{ formatPickupPointAddress(pickupPoint) }}
        </p>
        <p v-if="pickupPoint.pickupPointPhone">Tel: {{ pickupPoint.pickupPointPhone }}</p>
        <p v-if="pickupPoint.pickupPointHours">Horario: {{ pickupPoint.pickupPointHours }}</p>
      </div>

      <div v-if="order.customerNotes" class="mt-6">
        <p class="font-semibold">Notas del cliente</p>
        <p>{{ order.customerNotes }}</p>
      </div>
      <div v-if="order.internalNotes" class="mt-4">
        <p class="font-semibold">Notas internas</p>
        <p>{{ order.internalNotes }}</p>
      </div>
    </div>
  </div>
</template>

<style>
@media print {
  body * {
    visibility: hidden;
  }
  .print-sheet,
  .print-sheet * {
    visibility: visible;
  }
  .print-sheet {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }
}
</style>
