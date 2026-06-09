export type PaymentGatewayProvider = 'CULQI' | 'MERCADO_PAGO' | 'STRIPE'

export type PaymentGateway = {
  id: string
  provider: PaymentGatewayProvider
  displayName: string
  isEnabled: boolean
  isTestMode: boolean
  publicKey: string | null
  secretKey: string | null
  webhookSecret: string | null
  config: Record<string, unknown> | null
  updatedAt: string
}

export type UpdatePaymentGatewayPayload = {
  displayName?: string
  isEnabled?: boolean
  isTestMode?: boolean
  publicKey?: string
  secretKey?: string
  webhookSecret?: string
  config?: Record<string, unknown>
}

export type PaymentTransactionStatus =
  | 'PENDING'
  | 'COMPLETED'
  | 'FAILED'
  | 'REFUNDED'
  | 'CANCELLED'

export type PaymentTransaction = {
  id: string
  orderId: string
  orderNumber: string
  provider: PaymentGatewayProvider
  externalId: string | null
  amount: string
  currencyCode: string
  status: PaymentTransactionStatus
  metadata: Record<string, unknown> | null
  createdAt: string
  updatedAt: string
}
