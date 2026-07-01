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

export type MercadoPagoCredentialDiagnostics =
  | {
      configured: false
      healthy: false
      issues: string[]
    }
  | {
      configured: true
      isTestMode: boolean
      liveMode: boolean | null
      siteId: string | null
      userId: number | null
      isTestUserAccount: boolean
      publicKeyPreview: string
      healthy: boolean
      issues: string[]
      sandboxPayerEmailMode: 'order' | 'testuser' | 'synthetic' | null
      sandboxPayerEmail: string | null
    }

export type MercadoPagoWebhookSetup = {
  webhookUrl: string
  recommendedEvents: string[]
  secretConfigured: boolean
  signatureValidation: 'required' | 'optional'
  documentationPath: string
  credentials: MercadoPagoCredentialDiagnostics
}

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
