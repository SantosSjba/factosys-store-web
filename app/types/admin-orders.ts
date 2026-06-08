export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED'

export type OrderPaymentStatus =
  | 'PENDING'
  | 'PAID'
  | 'FAILED'
  | 'REFUNDED'
  | 'PARTIALLY_REFUNDED'

export type OrderFulfillmentStatus = 'UNFULFILLED' | 'PARTIAL' | 'FULFILLED'

export type OrderSource = 'ADMIN' | 'WEB' | 'PHONE'

export type OrderAddressType = 'SHIPPING' | 'BILLING'

export type OrderItem = {
  id: string
  variantId: string | null
  productId: string | null
  sku: string
  productName: string
  variantName: string | null
  quantity: number
  unitPrice: string
  compareAtPrice: string | null
  taxAmount: string
  lineSubtotal: string
  lineTotal: string
  sortOrder: number
}

export type OrderAddress = {
  id: string
  type: OrderAddressType
  label: string | null
  firstName: string | null
  lastName: string | null
  company: string | null
  phone: string | null
  email: string | null
  addressLine1: string
  addressLine2: string | null
  city: string | null
  district: string | null
  province: string | null
  department: string | null
  country: string
  postalCode: string | null
}

export type OrderStatusHistoryEntry = {
  id: string
  fromStatus: OrderStatus | null
  toStatus: OrderStatus
  fromPaymentStatus: OrderPaymentStatus | null
  toPaymentStatus: OrderPaymentStatus | null
  note: string | null
  performedById: string | null
  performedByName: string | null
  createdAt: string
}

export type OrderSummary = {
  id: string
  orderNumber: string
  status: OrderStatus
  paymentStatus: OrderPaymentStatus
  fulfillmentStatus: OrderFulfillmentStatus
  source: OrderSource
  customerId: string | null
  customerName: string | null
  customerEmail: string | null
  currencyCode: string
  total: string
  itemCount: number
  warehouseName: string | null
  createdAt: string
  updatedAt: string
}

export type OrderDetail = OrderSummary & {
  guestEmail: string | null
  guestFirstName: string | null
  guestLastName: string | null
  guestPhone: string | null
  warehouseId: string | null
  subtotal: string
  taxAmount: string
  shippingAmount: string
  discountAmount: string
  taxRateId: string | null
  taxRateName: string | null
  taxRatePercent: string | null
  pricesIncludeTax: boolean
  internalNotes: string | null
  customerNotes: string | null
  confirmedAt: string | null
  shippedAt: string | null
  deliveredAt: string | null
  cancelledAt: string | null
  paidAt: string | null
  cancelReason: string | null
  createdById: string | null
  createdByName: string | null
  items: OrderItem[]
  addresses: OrderAddress[]
  statusHistory: OrderStatusHistoryEntry[]
}

export type ListOrdersParams = {
  page?: number
  limit?: number
  search?: string
  status?: OrderStatus
  paymentStatus?: OrderPaymentStatus
  customerId?: string
  dateFrom?: string
  dateTo?: string
}

export type CreateOrderItemPayload = {
  variantId: string
  quantity: number
}

export type CreateOrderAddressPayload = {
  type: OrderAddressType
  label?: string
  firstName?: string
  lastName?: string
  company?: string
  phone?: string
  email?: string
  addressLine1: string
  addressLine2?: string
  city?: string
  district?: string
  province?: string
  department?: string
  country?: string
  postalCode?: string
}

export type CreateOrderPayload = {
  customerId?: string
  guestEmail?: string
  guestFirstName?: string
  guestLastName?: string
  guestPhone?: string
  warehouseId?: string
  items: CreateOrderItemPayload[]
  addresses?: CreateOrderAddressPayload[]
  customerNotes?: string
  internalNotes?: string
  paymentStatus?: OrderPaymentStatus
  source?: OrderSource
  shippingAmount?: number
  discountAmount?: number
}

export type UpdateOrderStatusPayload = {
  status: OrderStatus
  note?: string
}

export type UpdateOrderPaymentPayload = {
  paymentStatus: OrderPaymentStatus
  note?: string
}

export type CancelOrderPayload = {
  reason?: string
}
