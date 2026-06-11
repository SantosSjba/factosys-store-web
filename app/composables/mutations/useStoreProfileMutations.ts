import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { updateStoreProfile } from '~/api/store-profile.api'
import { storeQueryKeys } from '~/constants/query-keys'
import type { StoreProfile, UpdateStoreProfilePayload } from '~/types/auth'

function profileToUser(profile: StoreProfile) {
  return {
    id: profile.id,
    email: profile.email,
    userType: profile.userType,
    firstName: profile.firstName,
    lastName: profile.lastName,
    roles: ['customer'],
  }
}

export function useUpdateStoreProfileMutation() {
  const authStore = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation<StoreProfile, Error, UpdateStoreProfilePayload>({
    mutationFn: (payload) => updateStoreProfile(payload),
    onSuccess: (profile) => {
      authStore.profile = profile
      authStore.user = profileToUser(profile)
      queryClient.setQueryData(storeQueryKeys.profile(), profile)
    },
  })
}
