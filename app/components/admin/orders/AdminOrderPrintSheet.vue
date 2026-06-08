<script setup lang="ts">
import type { OrderDetail } from '~/types/admin-orders'
import type { StoreSettings } from '~/types/admin-settings'
import {
  formatDeliveryMethod,
  formatOrderStatus,
  formatPaymentStatus,
} from '~/utils/format-order'
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
        <h1 class="text-2xl font-bold">Pedido {{ order.orderNumber }}</h1>
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
          <p v-if="order.warehouseName">Almacén: {{ order.warehouseName }}</p>
        </div>
      </div>

      <table class="mb-6 w-full border-collapse text-left">
        <thead>
          <tr class="border-b border-black">
            <th class="py-2 pr-2">Producto</th>
            <th class="py-2 pr-2">SKU</th>
            <th class="py-2 pr-2 text-right">Cant.</th>
            <th class="py-2 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in order.items" :key="item.id" class="border-b border-gray-300">
            <td class="py-2 pr-2">
              {{ item.productName }}
              <span v-if="item.variantName" class="block text-xs text-gray-600">
                {{ item.variantName }}
              </span>
            </td>
            <td class="py-2 pr-2">{{ item.sku }}</td>
            <td class="py-2 pr-2 text-right">{{ item.quantity }}</td>
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
