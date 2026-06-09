import { useQuery } from '@tanstack/vue-query'
import { fetchAdminCampaigns } from '~/api/admin-campaigns.api'
import { adminQueryKeys } from '~/constants/query-keys'
import type { PaginationParams } from '~/types/pagination'

export function useAdminCampaignsQuery(
  params: MaybeRefOrGetter<PaginationParams> = {},
) {
  const adminAuth = useAdminAuthStore()
  const { can } = useAdminPermissions()

  const queryParams = computed(() => {
    const raw = toValue(params)
    return {
      page: raw.page ?? 1,
      limit: raw.limit ?? 10,
      search: raw.search?.trim() || undefined,
    }
  })

  return useQuery({
    queryKey: computed(() => [...adminQueryKeys.campaigns(), queryParams.value]),
    queryFn: () => fetchAdminCampaigns(queryParams.value),
    enabled: computed(() => {
      if (!adminAuth.accessToken) return false
      if (!adminAuth.profile) return true
      return can('marketing.read')
    }),
  })
}
