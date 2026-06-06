import { useQuery } from '@tanstack/vue-query'
import { fetchAdminCustomers } from '~/api/admin-customers.api'
import { adminQueryKeys } from '~/constants/query-keys'
import type { PaginationParams } from '~/types/pagination'

export function useAdminCustomersQuery(
  params: Ref<PaginationParams> | ComputedRef<PaginationParams>,
) {
  const { can } = useAdminPermissions()

  return useQuery({
    queryKey: computed(() => [...adminQueryKeys.customers(), unref(params)]),
    queryFn: () => fetchAdminCustomers(unref(params)),
    enabled: computed(() => can('users.read')),
  })
}
