import { useQuery } from '@tanstack/vue-query'
import { fetchStoreProfile } from '~/api/store-profile.api'
import { storeQueryKeys } from '~/constants/query-keys'
import type { AuthUser, StoreProfile } from '~/types/auth'

function profileToUser(profile: StoreProfile): AuthUser {
  return {
    id: profile.id,
    email: profile.email,
    userType: profile.userType,
    firstName: profile.firstName,
    lastName: profile.lastName,
    roles: ['customer'],
  }
}

export function useStoreProfileQuery() {
  const authStore = useAuthStore()

  return useQuery({
    queryKey: storeQueryKeys.profile(),
    queryFn: async () => {
      const profile = await fetchStoreProfile()
      authStore.profile = profile
      authStore.user = profileToUser(profile)
      return profile
    },
    enabled: computed(() => Boolean(authStore.accessToken)),
  })
}
