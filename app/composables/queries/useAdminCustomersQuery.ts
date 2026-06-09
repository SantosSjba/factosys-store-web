import { useQuery } from '@tanstack/vue-query'
import {
  fetchAdminCustomerAddresses,
  fetchAdminCustomers,
} from '~/api/admin-customers.api'
import { fetchAdminOrders } from '~/api/admin-orders.api'
import { adminQueryKeys } from '~/constants/query-keys'
import type { PaginationParams } from '~/types/pagination'

export function useAdminCustomersQuery(
  params: MaybeRefOrGetter<PaginationParams> = {},
) {
  const adminAuth = useAdminAuthStore()
  const { can } = useAdminPermissions()

  const queryParams = computed(() => {
    const value = toValue(params)
    return {
      page: value.page ?? 1,
      limit: value.limit ?? 10,
      search: value.search?.trim() || undefined,
    }
  })

  return useQuery({
    queryKey: computed(() => [...adminQueryKeys.customers(), queryParams.value]),
    queryFn: () => fetchAdminCustomers(queryParams.value),
    enabled: computed(() => {
      if (!adminAuth.accessToken) return false
      if (!adminAuth.profile) return true
      return can('users.read')
    }),
  })
}

function customersEnabled(canRead: () => boolean) {
  const adminAuth = useAdminAuthStore()
  return computed(() => {
    if (!adminAuth.accessToken) return false
    if (!adminAuth.profile) return true
    return canRead()
  })
}

export function useAdminCustomerAddressesQuery(
  customerId: MaybeRefOrGetter<string | null | undefined>,
) {
  const { can } = useAdminPermissions()
  const id = computed(() => toValue(customerId) || '')

  return useQuery({
    queryKey: computed(() => adminQueryKeys.customerAddresses(id.value)),
    queryFn: () => fetchAdminCustomerAddresses(id.value),
    enabled: computed(() => !!id.value && customersEnabled(() => can('users.read')).value),
  })
}

export function useAdminCustomerOrdersQuery(
  customerId: MaybeRefOrGetter<string | null | undefined>,
  options: { limit?: number } = {},
) {
  const { can } = useAdminPermissions()
  const id = computed(() => toValue(customerId) || '')

  return useQuery({
    queryKey: computed(() => [
      ...adminQueryKeys.orders(),
      { customerId: id.value, page: 1, limit: options.limit ?? 10 },
    ]),
    queryFn: () =>
      fetchAdminOrders({
        customerId: id.value,
        page: 1,
        limit: options.limit ?? 10,
      }),
    enabled: computed(() => !!id.value && customersEnabled(() => can('orders.read')).value),
  })
}
