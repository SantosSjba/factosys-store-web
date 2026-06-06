import { useQuery } from '@tanstack/vue-query'
import { fetchAdminCustomers } from '~/api/admin-customers.api'
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
