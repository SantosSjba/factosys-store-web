<script setup lang="ts">
import type { StoreCustomer } from '~/types/admin-customers'
import type { OrderSummary } from '~/types/admin-orders'
import {
  formatDeliveryMethod,
  formatFulfillmentStatus,
  formatOrderStatus,
  formatPaymentStatus,
  fulfillmentStatusVariant,
  orderStatusVariant,
  paymentStatusVariant,
} from '~/utils/format-order'
import {
  formatCustomerAddress,
  formatCustomerAddressLabel,
} from '~/utils/format-customer-address'

const open = defineModel<boolean>({ required: true })

const props = defineProps<{
  customer: StoreCustomer | null
}>()

const emit = defineEmits<{
  edit: []
  viewOrder: [orderId: string]
}>()

const { can } = useAdminPermissions()

const customerId = computed(() => (open.value ? props.customer?.id ?? null : null))

const { data: ordersPage, isPending: ordersPending } = useAdminCustomerOrdersQuery(customerId, {
  limit: 10,
})
const { data: addresses, isPending: addressesPending } = useAdminCustomerAddressesQuery(customerId)

const orders = computed(() => ordersPage.value?.items ?? [])

const displayName = computed(() =>
  props.customer ? formatUserName(props.customer) : '',
)

function openOrder(order: OrderSummary) {
  emit('viewOrder', order.id)
}
</script>

<template>
  <UiModal
    v-model="open"
    title="Detalle del cliente"
    :description="customer?.email"
    size="xl"
  >
    <div v-if="customer" class="space-y-5">
      <AdminFormSection
        title="Perfil del cliente"
        description="Información de la cuenta en la tienda online."
        icon="lucide:user-circle"
      >
        <div class="grid gap-3 sm:grid-cols-2">
          <AdminDetailCell label="Nombre">
            <p class="font-medium">{{ displayName }}</p>
          </AdminDetailCell>
          <AdminDetailCell label="Estado">
            <UiBadge :variant="userStatusVariant(customer.status)" class="normal-case">
              {{ formatUserStatus(customer.status) }}
            </UiBadge>
          </AdminDetailCell>
          <AdminDetailCell label="Acceso">
            <span class="text-sm">{{ formatAuthProvider(customer.authProvider) }}</span>
          </AdminDetailCell>
          <AdminDetailCell label="Teléfono">
            {{ customer.phone || '—' }}
          </AdminDetailCell>
        </div>
      </AdminFormSection>

      <AdminFormSection
        title="Verificación y registro"
        description="Historial de activación de la cuenta."
        icon="lucide:mail-check"
      >
        <div class="grid gap-3 sm:grid-cols-2">
          <AdminDetailCell label="Correo verificado">
            <span class="text-sm">{{ formatAdminDateTime(customer.emailVerifiedAt) }}</span>
          </AdminDetailCell>
          <AdminDetailCell label="Registrado">
            <span class="text-sm">{{ formatAdminDateTime(customer.createdAt) }}</span>
          </AdminDetailCell>
        </div>
      </AdminFormSection>

      <AdminFormSection
        v-if="can('orders.read')"
        title="Pedidos recientes"
        description="Últimos pedidos asociados a este cliente."
        icon="lucide:shopping-bag"
      >
        <div v-if="ordersPending" class="text-admin-muted flex items-center gap-2 py-4 text-sm">
          <UiSpinner size="sm" />
          Cargando pedidos…
        </div>
        <div v-else-if="!orders.length" class="text-admin-muted py-4 text-sm">
          Este cliente aún no tiene pedidos registrados.
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="text-admin-muted border-admin-line border-b text-left">
                <th class="px-2 py-2 font-medium">Pedido</th>
                <th class="px-2 py-2 font-medium">Estado</th>
                <th class="px-2 py-2 font-medium">Despacho</th>
                <th class="px-2 py-2 font-medium">Pago</th>
                <th class="px-2 py-2 text-right font-medium">Total</th>
                <th class="px-2 py-2 font-medium">Fecha</th>
                <th class="px-2 py-2" />
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="order in orders"
                :key="order.id"
                class="border-admin-line border-b last:border-0"
              >
                <td class="px-2 py-2">
                  <p class="font-medium">{{ order.orderNumber }}</p>
                  <p class="text-admin-muted text-xs">
                    {{ formatDeliveryMethod(order.deliveryMethod) }}
                  </p>
                </td>
                <td class="px-2 py-2">
                  <UiBadge :variant="orderStatusVariant(order.status)">
                    {{ formatOrderStatus(order.status) }}
                  </UiBadge>
                </td>
                <td class="px-2 py-2">
                  <UiBadge :variant="fulfillmentStatusVariant(order.fulfillmentStatus)">
                    {{ formatFulfillmentStatus(order.fulfillmentStatus) }}
                  </UiBadge>
                </td>
                <td class="px-2 py-2">
                  <UiBadge :variant="paymentStatusVariant(order.paymentStatus)">
                    {{ formatPaymentStatus(order.paymentStatus) }}
                  </UiBadge>
                </td>
                <td class="px-2 py-2 text-right font-medium">
                  {{ formatPrice(order.total, order.currencyCode) }}
                </td>
                <td class="text-admin-muted px-2 py-2 text-xs">
                  {{ formatAdminDate(order.createdAt) }}
                </td>
                <td class="px-2 py-2 text-right">
                  <UiIconButton
                    icon="lucide:eye"
                    ariaLabel="Ver pedido"
                    size="sm"
                    tone="admin"
                    @click="openOrder(order)"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </AdminFormSection>

      <AdminFormSection
        title="Direcciones"
        description="Direcciones usadas en pedidos anteriores."
        icon="lucide:map-pin"
      >
        <div
          v-if="addressesPending"
          class="text-admin-muted flex items-center gap-2 py-4 text-sm"
        >
          <UiSpinner size="sm" />
          Cargando direcciones…
        </div>
        <div v-else-if="!addresses?.length" class="text-admin-muted py-4 text-sm">
          No hay direcciones guardadas en pedidos de este cliente.
        </div>
        <div v-else class="grid gap-3 sm:grid-cols-2">
          <div
            v-for="address in addresses"
            :key="address.id"
            class="border-admin-line rounded-lg border p-3 text-sm"
          >
            <div class="mb-2 flex items-center justify-between gap-2">
              <p class="font-medium">{{ formatCustomerAddressLabel(address) }}</p>
              <UiBadge variant="default" class="normal-case">
                {{ address.type === 'SHIPPING' ? 'Envío' : 'Facturación' }}
              </UiBadge>
            </div>
            <p>{{ formatCustomerAddress(address) }}</p>
            <p v-if="address.phone" class="text-admin-muted mt-2 text-xs">
              Tel: {{ address.phone }}
            </p>
            <p class="text-admin-muted mt-2 text-xs">
              Último uso: {{ address.lastOrderNumber }} ·
              {{ formatAdminDate(address.lastUsedAt) }}
            </p>
          </div>
        </div>
      </AdminFormSection>
    </div>

    <template #footer>
      <UiButton variant="ghost" @click="open = false">Cerrar</UiButton>
      <UiButton v-if="can('users.update')" @click="emit('edit')">
        <UiIcon name="lucide:pencil" :size="16" class="mr-2" />
        Editar cliente
      </UiButton>
    </template>
  </UiModal>
</template>
