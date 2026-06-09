import type {
  CancelOrderPayload,
  CreateOrderPayload,
  ListOrdersParams,
  OrderDetail,
  OrderSummary,
  RefundOrderPayload,
  UpdateOrderPaymentPayload,
  UpdateOrderStatusPayload,
} from '~/types/admin-orders'
import type { PaginatedResponse } from '~/types/pagination'

export async function fetchAdminOrders(params: ListOrdersParams = {}) {
  const { data } = await useAdminApi().get<PaginatedResponse<OrderSummary>>(
    '/admin/orders',
    { params: { page: 1, limit: 10, ...params } },
  )
  return data
}

export async function fetchAdminOrder(id: string) {
  const { data } = await useAdminApi().get<OrderDetail>(`/admin/orders/${id}`)
  return data
}

export async function createAdminOrder(payload: CreateOrderPayload) {
  const { data } = await useAdminApi().post<OrderDetail>('/admin/orders', payload)
  return data
}

export async function updateAdminOrderStatus(id: string, payload: UpdateOrderStatusPayload) {
  const { data } = await useAdminApi().patch<OrderDetail>(
    `/admin/orders/${id}/status`,
    payload,
  )
  return data
}

export async function updateAdminOrderPayment(id: string, payload: UpdateOrderPaymentPayload) {
  const { data } = await useAdminApi().patch<OrderDetail>(
    `/admin/orders/${id}/payment`,
    payload,
  )
  return data
}

export async function cancelAdminOrder(id: string, payload: CancelOrderPayload = {}) {
  const { data } = await useAdminApi().post<OrderDetail>(
    `/admin/orders/${id}/cancel`,
    payload,
  )
  return data
}

export async function refundAdminOrder(id: string, payload: RefundOrderPayload) {
  const { data } = await useAdminApi().post<OrderDetail>(
    `/admin/orders/${id}/refund`,
    payload,
  )
  return data
}
