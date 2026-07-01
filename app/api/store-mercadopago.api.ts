import type {
  MercadoPagoPaymentContext,
  MercadoPagoPaymentMethods,
  MercadoPagoPaymentResult,
  MercadoPagoStoreConfig,
} from '~/types/store-checkout'

export type ProcessMercadoPagoPaymentPayload = {
  paymentChannel: 'card' | 'yape'
  token: string
  paymentMethodId: string
  paymentMethodType?: string
  installments?: number
  payerEmail: string
  payerIdentification?: {
    type?: string
    number?: string
  }
  idempotencyKey?: string
}

export async function fetchMercadoPagoConfig(): Promise<MercadoPagoStoreConfig> {
  const { data } = await useApi().get<MercadoPagoStoreConfig>(
    '/store/payments/mercadopago/config',
    { withAuth: false },
  )
  return data
}

export async function fetchMercadoPagoPaymentMethods(): Promise<MercadoPagoPaymentMethods> {
  const { data } = await useApi().get<MercadoPagoPaymentMethods>(
    '/store/payments/mercadopago/payment-methods',
    { withAuth: false },
  )
  return data
}

export async function fetchMercadoPagoPaymentContext(
  orderId: string,
  guestEmail?: string,
): Promise<MercadoPagoPaymentContext> {
  const { data } = await useApi().get<MercadoPagoPaymentContext>(
    `/store/payments/mercadopago/orders/${orderId}/payment-context`,
    {
      withAuth: !guestEmail,
      params: guestEmail ? { email: guestEmail } : undefined,
    },
  )
  return data
}

export async function processMercadoPagoPayment(
  orderId: string,
  payload: ProcessMercadoPagoPaymentPayload,
): Promise<MercadoPagoPaymentResult> {
  const { data } = await useApi().post<MercadoPagoPaymentResult>(
    `/store/payments/mercadopago/orders/${orderId}/pay`,
    payload,
  )
  return data
}
