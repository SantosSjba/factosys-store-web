import type {
  OrderAddress,
  OrderDeliveryMethod,
  OrderFulfillmentStatus,
  OrderItem,
  OrderPaymentMethod,
  OrderPaymentStatus,
  OrderStatus,
} from '~/types/admin-orders'

export type StoreOrderPreviewItem = {
  productName: string
  variantName: string | null
  quantity: number
  imageUrl: string | null
}

export type StoreOrderSummary = {
  id: string
  orderNumber: string
  status: OrderStatus
  paymentStatus: OrderPaymentStatus
  deliveryMethod: OrderDeliveryMethod
  currencyCode: string
  total: string
  itemCount: number
  previewItem: StoreOrderPreviewItem | null
  extraItemsCount: number
  deliveredAt: string | null
  shippedAt: string | null
  createdAt: string
}

export type StoreOrderStatusHistoryEntry = {
  id: string
  toStatus: OrderStatus
  toPaymentStatus: OrderPaymentStatus | null
  note: string | null
  createdAt: string
}

export type StoreOrderDetail = {
  id: string
  orderNumber: string
  status: OrderStatus
  paymentStatus: OrderPaymentStatus
  fulfillmentStatus: OrderFulfillmentStatus
  deliveryMethod: OrderDeliveryMethod
  currencyCode: string
  subtotal: string
  taxAmount: string
  shippingAmount: string
  discountAmount: string
  total: string
  itemCount: number
  paymentMethod: OrderPaymentMethod | null
  trackingNumber: string | null
  carrier: string | null
  trackingUrl: string | null
  customerNotes: string | null
  confirmedAt: string | null
  shippedAt: string | null
  deliveredAt: string | null
  cancelledAt: string | null
  paidAt: string | null
  createdAt: string
  updatedAt: string
  items: OrderItem[]
  addresses: OrderAddress[]
  statusHistory: StoreOrderStatusHistoryEntry[]
}
