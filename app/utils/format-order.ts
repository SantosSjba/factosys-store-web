import type {
  OrderDeliveryMethod,
  OrderFulfillmentStatus,
  OrderPaymentStatus,
  OrderStatus,
} from '~/types/admin-orders'

const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING_PAYMENT: 'Pendiente de pago',
  CONFIRMED: 'Confirmado',
  PROCESSING: 'En preparación',
  READY_FOR_PICKUP: 'Listo para recoger',
  SHIPPED: 'Enviado',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado',
  REFUNDED: 'Reembolsado',
}

const ORDER_STATUS_VARIANTS: Record<
  OrderStatus,
  'default' | 'info' | 'success' | 'warning' | 'danger'
> = {
  PENDING_PAYMENT: 'warning',
  CONFIRMED: 'info',
  PROCESSING: 'info',
  READY_FOR_PICKUP: 'success',
  SHIPPED: 'info',
  DELIVERED: 'success',
  CANCELLED: 'danger',
  REFUNDED: 'default',
}

const PAYMENT_STATUS_LABELS: Record<OrderPaymentStatus, string> = {
  PENDING: 'Pendiente',
  PAID: 'Pagado',
  FAILED: 'Fallido',
  REFUNDED: 'Reembolsado',
  PARTIALLY_REFUNDED: 'Reembolso parcial',
}

const PAYMENT_STATUS_VARIANTS: Record<
  OrderPaymentStatus,
  'default' | 'info' | 'success' | 'warning' | 'danger'
> = {
  PENDING: 'warning',
  PAID: 'success',
  FAILED: 'danger',
  REFUNDED: 'default',
  PARTIALLY_REFUNDED: 'warning',
}

export function formatOrderStatus(status: OrderStatus) {
  return ORDER_STATUS_LABELS[status] ?? status
}

export function orderStatusVariant(status: OrderStatus) {
  return ORDER_STATUS_VARIANTS[status] ?? 'default'
}

export function formatPaymentStatus(status: OrderPaymentStatus) {
  return PAYMENT_STATUS_LABELS[status] ?? status
}

export function paymentStatusVariant(status: OrderPaymentStatus) {
  return PAYMENT_STATUS_VARIANTS[status] ?? 'default'
}

const FULFILLMENT_STATUS_LABELS: Record<OrderFulfillmentStatus, string> = {
  UNFULFILLED: 'Sin despachar',
  PARTIAL: 'Despacho parcial',
  FULFILLED: 'Despachado',
}

const FULFILLMENT_STATUS_VARIANTS: Record<
  OrderFulfillmentStatus,
  'default' | 'info' | 'success' | 'warning' | 'danger'
> = {
  UNFULFILLED: 'warning',
  PARTIAL: 'info',
  FULFILLED: 'success',
}

export const OPERATIONAL_ORDER_STATUS_OPTIONS = (
  Object.entries(ORDER_STATUS_LABELS) as [OrderStatus, string][]
)
  .filter(([value]) => value !== 'REFUNDED' && value !== 'CANCELLED')
  .map(([value, label]) => ({ value, label }))

export const OPERATIONAL_PAYMENT_STATUS_OPTIONS = (
  Object.entries(PAYMENT_STATUS_LABELS) as [OrderPaymentStatus, string][]
)
  .filter(([value]) => value !== 'REFUNDED' && value !== 'PARTIALLY_REFUNDED')
  .map(([value, label]) => ({ value, label }))

export const ORDER_STATUS_OPTIONS = Object.entries(ORDER_STATUS_LABELS).map(
  ([value, label]) => ({ value, label }),
)

export const PAYMENT_STATUS_OPTIONS = Object.entries(PAYMENT_STATUS_LABELS).map(
  ([value, label]) => ({ value, label }),
)

export function formatFulfillmentStatus(status: OrderFulfillmentStatus) {
  return FULFILLMENT_STATUS_LABELS[status] ?? status
}

export function fulfillmentStatusVariant(status: OrderFulfillmentStatus) {
  return FULFILLMENT_STATUS_VARIANTS[status] ?? 'default'
}

const DELIVERY_METHOD_LABELS: Record<OrderDeliveryMethod, string> = {
  SHIPPING: 'Envío a domicilio',
  PICKUP: 'Recojo en tienda',
}

export function formatDeliveryMethod(method: OrderDeliveryMethod) {
  return DELIVERY_METHOD_LABELS[method] ?? method
}
