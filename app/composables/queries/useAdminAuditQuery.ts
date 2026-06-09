import { useQuery } from '@tanstack/vue-query'
import { fetchAdminAudit } from '~/api/admin-audit.api'
import { adminQueryKeys } from '~/constants/query-keys'
import type { ListAuditParams } from '~/types/admin-audit'

export function useAdminAuditQuery(params: MaybeRefOrGetter<ListAuditParams> = {}) {
  const adminAuth = useAdminAuthStore()
  const { can } = useAdminPermissions()

  const queryParams = computed(() => {
    const raw = toValue(params)
    return {
      page: raw.page ?? 1,
      limit: raw.limit ?? 20,
      module: raw.module?.trim() || undefined,
      search: raw.search?.trim() || undefined,
    }
  })

  return useQuery({
    queryKey: computed(() => [...adminQueryKeys.audit(), queryParams.value]),
    queryFn: () => fetchAdminAudit(queryParams.value),
    enabled: computed(() => {
      if (!adminAuth.accessToken) return false
      if (!adminAuth.profile) return true
      return can('audit.read')
    }),
  })
}
