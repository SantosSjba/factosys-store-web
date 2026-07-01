import type { OrderDeliveryMethod, OrderPaymentMethod } from '~/types/admin-orders'
import type {
  StoreCheckoutPaymentSettings,
  StoreCheckoutPickupPoint,
} from '~/types/store-checkout'

type PaymentGuideInput = {
  paymentMethod: OrderPaymentMethod
  deliveryMethod: OrderDeliveryMethod
  payments: StoreCheckoutPaymentSettings
  pickup?: StoreCheckoutPickupPoint
}

export function getDeliveryGuide(
  deliveryMethod: OrderDeliveryMethod,
  pickup?: StoreCheckoutPickupPoint,
) {
  if (deliveryMethod === 'PICKUP') {
    if (pickup?.name) {
      return `Recogerás tu pedido en ${pickup.name}. Te avisaremos por correo cuando esté listo para retirar.`
    }
    return 'Recogerás tu pedido en nuestro punto de recojo. Te avisaremos cuando esté listo.'
  }

  return 'Enviaremos tu pedido a la dirección indicada. El costo y plazo de envío dependen de tu zona.'
}

export function getPaymentGuide({
  paymentMethod,
  deliveryMethod,
  payments,
}: PaymentGuideInput) {
  switch (paymentMethod) {
    case 'CASH':
      return deliveryMethod === 'PICKUP'
        ? 'Pagarás en efectivo al recoger tu pedido. Te confirmaremos el monto total antes del retiro.'
        : 'Pagarás en efectivo al momento de la entrega. Ten a mano el monto de tu pedido si es posible.'

    case 'BANK_TRANSFER': {
      const instructions = payments.bankTransfer.instructions?.trim()
      const pending =
        'Tu pedido quedará pendiente de pago hasta que confirmemos el abono en nuestro sistema.'
      return instructions ? `${instructions}\n\n${pending}` : pending
    }

    case 'YAPE': {
      const number = payments.yape.number?.trim()
      const pending =
        'Tu pedido quedará pendiente hasta que confirmemos tu pago por Yape.'
      return number
        ? `Envía el monto total al Yape ${number} e indica tu número de pedido en el mensaje.\n\n${pending}`
        : `Te indicaremos el número Yape al confirmar el pedido.\n\n${pending}`
    }

    case 'PLIN': {
      const number = payments.plin.number?.trim()
      const pending =
        'Tu pedido quedará pendiente hasta que confirmemos tu pago por Plin.'
      return number
        ? `Envía el monto total al Plin ${number} e indica tu número de pedido en el mensaje.\n\n${pending}`
        : `Te indicaremos el número Plin al confirmar el pedido.\n\n${pending}`
    }

    case 'GATEWAY': {
      const accepted = (payments.gateway.acceptedMethods ?? [])
        .map((method) => method.name)
        .join(', ')
      const methodsLine = accepted
        ? `Aceptamos: ${accepted}.`
        : 'Aceptamos tarjetas Visa, Mastercard, American Express, Diners y Yape.'
      const sandboxLine = payments.gateway.isTestMode
        ? ' En modo prueba de Mercado Pago usa el correo test@testuser.com al pagar.'
        : ''
      return `${methodsLine} Al confirmar el pedido completarás el pago con Checkout API de Mercado Pago en nuestra tienda (sin salir del sitio).${sandboxLine}`
    }

    default:
      return null
  }
}
