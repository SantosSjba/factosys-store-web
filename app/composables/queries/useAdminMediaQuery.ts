import { useQuery } from '@tanstack/vue-query'
import { fetchAdminMedia } from '~/api/admin-media.api'
import { adminQueryKeys } from '~/constants/query-keys'
import type { ListMediaParams } from '~/types/admin-media'

export function useAdminMediaQuery(params: MaybeRefOrGetter<ListMediaParams> = {}) {
  const adminAuth = useAdminAuthStore()
  const { can } = useAdminPermissions()

  const queryParams = computed(() => {
    const raw = toValue(params)
    return {
      page: raw.page ?? 1,
      limit: raw.limit ?? 24,
      search: raw.search?.trim() || undefined,
      folder: raw.folder?.trim() || undefined,
    }
  })

  return useQuery({
    queryKey: computed(() => [...adminQueryKeys.media(), queryParams.value]),
    queryFn: () => fetchAdminMedia(queryParams.value),
    enabled: computed(() => {
      if (!adminAuth.accessToken) return false
      if (!adminAuth.profile) return true
      return can('media.read')
    }),
  })
}
