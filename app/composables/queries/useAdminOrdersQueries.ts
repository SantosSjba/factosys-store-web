import { useQuery } from '@tanstack/vue-query'
import { fetchAdminOrder, fetchAdminOrders } from '~/api/admin-orders.api'
import { adminQueryKeys } from '~/constants/query-keys'
import type { ListOrdersParams } from '~/types/admin-orders'

function ordersEnabled(canRead: () => boolean) {
  const adminAuth = useAdminAuthStore()
  return computed(() => {
    if (!adminAuth.accessToken) return false
    if (!adminAuth.profile) return true
    return canRead()
  })
}

export function useAdminOrdersQuery(params: MaybeRefOrGetter<ListOrdersParams> = {}) {
  const { can } = useAdminPermissions()
  const queryParams = computed(() => {
    const raw = toValue(params)
    return {
      page: raw.page ?? 1,
      limit: raw.limit ?? 10,
      search: raw.search?.trim() || undefined,
      status: raw.status || undefined,
      paymentStatus: raw.paymentStatus || undefined,
      customerId: raw.customerId || undefined,
      deliveryMethod: raw.deliveryMethod || undefined,
      dateFrom: raw.dateFrom || undefined,
      dateTo: raw.dateTo || undefined,
    }
  })

  return useQuery({
    queryKey: computed(() => [...adminQueryKeys.orders(), queryParams.value]),
    queryFn: () => fetchAdminOrders(queryParams.value),
    enabled: ordersEnabled(() => can('orders.read')),
  })
}

export function useAdminOrderQuery(id: MaybeRefOrGetter<string | null | undefined>) {
  const { can } = useAdminPermissions()
  const orderId = computed(() => toValue(id) || '')

  return useQuery({
    queryKey: computed(() => adminQueryKeys.order(orderId.value)),
    queryFn: () => fetchAdminOrder(orderId.value),
    enabled: computed(() => !!orderId.value && ordersEnabled(() => can('orders.read')).value),
  })
}
