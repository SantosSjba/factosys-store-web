import type {
  OrderDeliveryMethod,
  OrderPaymentStatus,
  OrderStatus,
} from '~/types/admin-orders'

const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING_PAYMENT: 'Pendiente de pago',
  CONFIRMED: 'Confirmado',
  PROCESSING: 'En preparación',
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

export const ORDER_STATUS_OPTIONS = Object.entries(ORDER_STATUS_LABELS).map(
  ([value, label]) => ({ value, label }),
)

export const PAYMENT_STATUS_OPTIONS = Object.entries(PAYMENT_STATUS_LABELS).map(
  ([value, label]) => ({ value, label }),
)

const DELIVERY_METHOD_LABELS: Record<OrderDeliveryMethod, string> = {
  SHIPPING: 'Envío a domicilio',
  PICKUP: 'Recojo en tienda',
}

export function formatDeliveryMethod(method: OrderDeliveryMethod) {
  return DELIVERY_METHOD_LABELS[method] ?? method
}
