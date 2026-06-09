import { useQuery } from '@tanstack/vue-query'
import { fetchAdminReturn, fetchAdminReturns } from '~/api/admin-returns.api'
import { adminQueryKeys } from '~/constants/query-keys'
import type { ListReturnsParams } from '~/types/admin-returns'

export function useAdminReturnsQuery(params: MaybeRefOrGetter<ListReturnsParams> = {}) {
  const adminAuth = useAdminAuthStore()
  const { can } = useAdminPermissions()

  const queryParams = computed(() => {
    const raw = toValue(params)
    return {
      page: raw.page ?? 1,
      limit: raw.limit ?? 10,
      status: raw.status || undefined,
      search: raw.search?.trim() || undefined,
    }
  })

  return useQuery({
    queryKey: computed(() => [...adminQueryKeys.returns(), queryParams.value]),
    queryFn: () => fetchAdminReturns(queryParams.value),
    enabled: computed(() => {
      if (!adminAuth.accessToken) return false
      if (!adminAuth.profile) return true
      return can('returns.read')
    }),
  })
}

export function useAdminReturnQuery(id: MaybeRefOrGetter<string | null>) {
  const adminAuth = useAdminAuthStore()
  const { can } = useAdminPermissions()
  const returnId = computed(() => toValue(id))

  return useQuery({
    queryKey: computed(() => adminQueryKeys.return(returnId.value ?? '')),
    queryFn: () => fetchAdminReturn(returnId.value!),
    enabled: computed(() => {
      if (!returnId.value) return false
      if (!adminAuth.accessToken) return false
      if (!adminAuth.profile) return true
      return can('returns.read')
    }),
  })
}
