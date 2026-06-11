import { useQuery } from '@tanstack/vue-query'
import { fetchAdminProfile } from '~/api/admin-profile.api'
import { adminQueryKeys } from '~/constants/query-keys'
import type { AdminProfile, AuthTokensResponse } from '~/types/auth'

function profileToUser(profile: AdminProfile): AuthTokensResponse['user'] {
  return {
    id: profile.id,
    email: profile.email,
    userType: profile.userType,
    firstName: profile.firstName,
    lastName: profile.lastName,
    roles: mapProfileRoleSlugs(profile.roles),
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
