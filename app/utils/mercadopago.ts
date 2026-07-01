import { loadMercadoPago } from '@mercadopago/sdk-js'

type MercadoPagoCardPaymentFormData = {
  token: string
  payment_method_id: string
  installments: number
  transaction_amount: number
  payer: {
    email: string
    identification?: {
      type?: string
      number?: string
    }
  }
}

type MercadoPagoCardPaymentAdditionalData = {
  paymentTypeId?: string
}

type MercadoPagoCardPaymentBrickController = {
  unmount: () => void
}

type MercadoPagoBricksBuilder = {
  create: (
    brickType: 'cardPayment',
    containerId: string,
    settings: {
      initialization: {
        amount: number
        payer?: {
          email?: string
        }
      }
      customization?: {
        visual?: {
          style?: {
            theme?: 'default' | 'dark' | 'bootstrap' | 'flat'
          }
        }
      }
      callbacks: {
        onReady?: () => void
        onError?: (error: unknown) => void
        onSubmit?: (
          formData: MercadoPagoCardPaymentFormData,
          additionalData?: MercadoPagoCardPaymentAdditionalData,
        ) => Promise<void>
      }
    },
  ) => Promise<MercadoPagoCardPaymentBrickController>
}

type MercadoPagoYapeInstance = {
  create: () => Promise<{ id: string }>
}

type MercadoPagoConstructor = new (
  publicKey: string,
  options?: { locale?: string },
) => MercadoPagoInstance

type MercadoPagoInstance = {
  bricks: () => MercadoPagoBricksBuilder
  yape: (options: { otp: string; phoneNumber: string }) => MercadoPagoYapeInstance
}

declare global {
  interface Window {
    MercadoPago?: MercadoPagoConstructor
  }
}

export async function getMercadoPagoClient(publicKey: string) {
  if (import.meta.server) {
    throw new Error('Mercado Pago solo está disponible en el navegador')
  }

  await loadMercadoPago()

  if (!window.MercadoPago) {
    throw new Error('Mercado Pago SDK no disponible')
  }

  return new window.MercadoPago(publicKey, { locale: 'es-PE' })
}

export type {
  MercadoPagoBricksBuilder,
  MercadoPagoCardPaymentAdditionalData,
  MercadoPagoCardPaymentBrickController,
  MercadoPagoCardPaymentFormData,
  MercadoPagoYapeInstance,
}
