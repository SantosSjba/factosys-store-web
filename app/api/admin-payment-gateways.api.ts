import type {
  PaymentGateway,
  PaymentGatewayProvider,
  PaymentTransaction,
  UpdatePaymentGatewayPayload,
} from '~/types/admin-payment-gateways'

export async function fetchAdminPaymentGateways() {
  const { data } = await useAdminApi().get<PaymentGateway[]>('/admin/payment-gateways')
  return data
}

export async function updateAdminPaymentGateway(
  provider: PaymentGatewayProvider,
  payload: UpdatePaymentGatewayPayload,
) {
  const { data } = await useAdminApi().patch<PaymentGateway>(
    `/admin/payment-gateways/${provider}`,
    payload,
  )
  return data
}

export async function fetchAdminPaymentTransactions(orderId?: string) {
  const { data } = await useAdminApi().get<PaymentTransaction[]>(
    '/admin/payment-transactions',
    { params: orderId ? { orderId } : undefined },
  )
  return data
}
