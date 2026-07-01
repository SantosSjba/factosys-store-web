import type { OrderPaymentMethod } from '~/types/admin-orders'

const PAYMENT_METHOD_LABELS: Record<OrderPaymentMethod, string> = {
  CASH: 'Efectivo',
  BANK_TRANSFER: 'Transferencia bancaria',
  YAPE: 'Yape',
  PLIN: 'Plin',
  CARD: 'Tarjeta',
  GATEWAY: 'Mercado Pago',
}

export function formatPaymentMethod(method: OrderPaymentMethod | string | null): string {
  if (!method) return '—'
  return PAYMENT_METHOD_LABELS[method as OrderPaymentMethod] ?? method
}

export const PAYMENT_METHOD_OPTIONS = Object.entries(PAYMENT_METHOD_LABELS).map(
  ([value, label]) => ({
    value: value as OrderPaymentMethod,
    label,
  }),
)
