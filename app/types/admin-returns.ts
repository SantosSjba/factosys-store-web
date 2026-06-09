export type ReturnRequestStatus =
  | 'REQUESTED'
  | 'APPROVED'
  | 'REJECTED'
  | 'RECEIVED'
  | 'REFUNDED'
  | 'CANCELLED'

export type ReturnRequestReason =
  | 'DEFECTIVE'
  | 'WRONG_ITEM'
  | 'NOT_AS_DESCRIBED'
  | 'CHANGED_MIND'
  | 'OTHER'

export type ReturnRequestItem = {
  id: string
  quantity: number
  orderItem: {
    id: string
    sku: string
    productName: string
    variantName: string | null
  }
}

export type ReturnRequestSummary = {
  id: string
  returnNumber: string
  orderId: string
  order: {
    id: string
    orderNumber: string
    total: string
    currencyCode: string
  }
  status: ReturnRequestStatus
  reason: ReturnRequestReason
  reasonNote: string | null
  restockItems: boolean
  refundAmount: string | null
  internalNotes: string | null
  requestedAt: string
  approvedAt: string | null
  receivedAt: string | null
  refundedAt: string | null
  rejectedAt: string | null
  items: ReturnRequestItem[]
  createdBy: { id: string; email: string; name: string | null } | null
  handledBy: { id: string; email: string; name: string | null } | null
}

export type ListReturnsParams = {
  page?: number
  limit?: number
  status?: ReturnRequestStatus
  search?: string
}

export type CreateReturnItemPayload = {
  orderItemId: string
  quantity: number
}

export type CreateReturnPayload = {
  orderId: string
  reason: ReturnRequestReason
  reasonNote?: string
  items: CreateReturnItemPayload[]
  restockItems?: boolean
  internalNotes?: string
}

export type UpdateReturnStatusPayload = {
  status: ReturnRequestStatus
  refundAmount?: number
  internalNotes?: string
}
