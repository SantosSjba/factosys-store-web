import { useQuery } from '@tanstack/vue-query'
import { fetchAdminProfile } from '~/api/admin-profile.api'
import { adminQueryKeys } from '~/constants/query-keys'
import type { AuthTokensResponse, StoreProfile } from '~/types/auth'

function profileToUser(profile: StoreProfile): AuthTokensResponse['user'] {
  return {
    id: profile.id,
    email: profile.email,
    userType: profile.userType,
    firstName: profile.firstName,
    lastName: profile.lastName,
    roles: profile.roles,
  }
}

export function useAdminProfileQuery() {
  const adminAuth = useAdminAuthStore()

  return useQuery({
    queryKey: adminQueryKeys.profile(),
    queryFn: async () => {
      const profile = await fetchAdminProfile()
      adminAuth.profile = profile
      adminAuth.user = profileToUser(profile)
      return profile
    },
    enabled: computed(() => Boolean(adminAuth.accessToken)),
  })
}
