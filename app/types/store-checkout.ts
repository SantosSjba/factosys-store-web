import type { OrderDeliveryMethod, OrderPaymentMethod } from '~/types/admin-orders'
import type { StoreOrderDetail } from '~/types/store-orders'

export type StoreCheckoutPickupPoint = {
  name: string | null
  address: string | null
  district: string | null
  province: string | null
  department: string | null
  hours: string | null
  phone: string | null
}

export type StoreCheckoutPaymentSettings = {
  cash: boolean
  bankTransfer: {
    enabled: boolean
    instructions: string | null
  }
  yape: {
    enabled: boolean
    number: string | null
  }
  plin: {
    enabled: boolean
    number: string | null
  }
}

export type StoreCheckoutSettings = {
  minOrderAmount: number | null
  freeShippingMinAmount: number | null
  flatShippingFee: number | null
  handlingDaysMin: number | null
  handlingDaysMax: number | null
  currencyCode: string
  tax: {
    name: string
    rate: string
    pricesIncludeTax: boolean
  } | null
  pickup: StoreCheckoutPickupPoint
  payments: StoreCheckoutPaymentSettings
}

export type StoreCheckoutQuotePayload = {
  deliveryMethod: OrderDeliveryMethod
  department?: string
  province?: string
  couponCode?: string
}

export type StoreCheckoutStockIssue = {
  variantId: string
  productName: string
  variantName: string | null
  requestedQuantity: number
  availableQuantity: number
}

export type StoreCheckoutQuote = {
  deliveryMethod: OrderDeliveryMethod
  currencyCode: string
  itemCount: number
  lines: Array<{
    variantId: string
    productName: string
    variantName: string | null
    quantity: number
    unitPrice: number
    lineSubtotal: number
    availableQuantity: number
  }>
  subtotal: number
  taxAmount: number
  shippingAmount: number
  shippingZoneName: string | null
  isFreeShipping: boolean
  discountAmount: number
  couponCode: string | null
  total: number
  stockIssues: StoreCheckoutStockIssue[]
  canPlaceOrder: boolean
}

export type StoreCheckoutShippingAddressPayload = {
  firstName?: string
  lastName?: string
  phone?: string
  addressLine1: string
  addressLine2?: string
  district: string
  province: string
  department: string
  country?: string
}

export type StorePlaceOrderPayload = StoreCheckoutQuotePayload & {
  paymentMethod: OrderPaymentMethod
  customerNotes?: string
  shippingAddress?: StoreCheckoutShippingAddressPayload
}

export type StorePlaceOrderResult = StoreOrderDetail
