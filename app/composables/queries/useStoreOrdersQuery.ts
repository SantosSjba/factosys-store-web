import { useQuery } from '@tanstack/vue-query'
import { fetchStoreOrder, fetchStoreOrders } from '~/api/store-orders.api'
import { storeQueryKeys } from '~/constants/query-keys'
import type { OrderStatus } from '~/types/admin-orders'
import type { PaginatedResponse } from '~/types/pagination'
import type { StoreOrderDetail, StoreOrderSummary } from '~/types/store-orders'

export function useStoreOrdersQuery(
  params: MaybeRefOrGetter<{
    page?: number
    limit?: number
    status?: OrderStatus
    activeOnly?: boolean
  }> = {},
) {
  const queryParams = computed(() => {
    const raw = toValue(params)
    return {
      page: raw.page ?? 1,
      limit: raw.limit ?? 6,
      status: raw.status,
      activeOnly: raw.activeOnly,
    }
  })

  return useQuery<PaginatedResponse<StoreOrderSummary>>({
    queryKey: computed(() => [...storeQueryKeys.orders(), queryParams.value]),
    queryFn: () => fetchStoreOrders(queryParams.value),
    staleTime: 30 * 1000,
  })
}

export function useStoreOrderQuery(orderId: MaybeRefOrGetter<string>) {
  const resolvedId = computed(() => toValue(orderId).trim())

  return useQuery<StoreOrderDetail>({
    queryKey: computed(() => storeQueryKeys.order(resolvedId.value)),
    queryFn: () => fetchStoreOrder(resolvedId.value),
    enabled: computed(() => resolvedId.value.length > 0),
    staleTime: 30 * 1000,
  })
}
