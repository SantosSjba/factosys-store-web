import { useMutation, useQueryClient } from '@tanstack/vue-query'
import {
  loginStoreUser,
  registerStoreUser,
  verifyStoreEmail,
} from '~/api/store-auth.api'
import { storeQueryKeys } from '~/constants/query-keys'
import type { LoginPayload, RegisterPayload } from '~/types/auth'

export function useStoreLoginMutation() {
  const authStore = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: LoginPayload) => loginStoreUser(payload),
    onSuccess: (tokens) => {
      authStore.setSession(tokens)
      queryClient.invalidateQueries({ queryKey: storeQueryKeys.all })
    },
  })
}

export function useStoreRegisterMutation() {
  return useMutation({
    mutationFn: (payload: RegisterPayload) => registerStoreUser(payload),
  })
}

export function useStoreVerifyEmailMutation() {
  const authStore = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (token: string) => verifyStoreEmail(token),
    onSuccess: (tokens) => {
      authStore.setSession(tokens)
      queryClient.invalidateQueries({ queryKey: storeQueryKeys.all })
    },
  })
}
