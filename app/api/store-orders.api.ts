import type { OrderStatus } from '~/types/admin-orders'
import type { PaginatedResponse, PaginationParams } from '~/types/pagination'
import type { StoreOrderDetail, StoreOrderSummary } from '~/types/store-orders'

export type ListStoreOrdersParams = PaginationParams & {
  status?: OrderStatus
  activeOnly?: boolean
}

export async function fetchStoreOrders(params: ListStoreOrdersParams = {}) {
  const { data } = await useApi().get<PaginatedResponse<StoreOrderSummary>>(
    '/store/orders',
    { params },
  )
  return data
}

export async function fetchStoreOrder(id: string) {
  const { data } = await useApi().get<StoreOrderDetail>(`/store/orders/${id}`)
  return data
}
