import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { mergeStoreGuestCart } from '~/api/store-cart.api'
import {
  loginStoreUser,
  registerStoreUser,
  resendStoreVerification,
  verifyStoreEmail,
} from '~/api/store-auth.api'
import { storeQueryKeys } from '~/constants/query-keys'
import type {
  AuthTokensResponse,
  LoginPayload,
  RegisterPayload,
  ResendVerificationResponse,
  VerifyEmailPayload,
} from '~/types/auth'

async function finalizeStoreLogin(
  authStore: ReturnType<typeof useAuthStore>,
  queryClient: ReturnType<typeof useQueryClient>,
  tokens: AuthTokensResponse,
) {
  authStore.setSession(tokens)

  const guestCart = useGuestCartToken()
  if (guestCart.token.value) {
    try {
      await mergeStoreGuestCart()
    } catch {
      // Si falla la fusión, el carrito del usuario sigue disponible.
    }
    guestCart.clear()
  }

  queryClient.invalidateQueries({ queryKey: storeQueryKeys.all })
}

export function useStoreLoginMutation() {
  const authStore = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation<AuthTokensResponse, Error, LoginPayload>({
    mutationFn: (payload: LoginPayload) => loginStoreUser(payload),
    onSuccess: async (tokens) => {
      await finalizeStoreLogin(authStore, queryClient, tokens)
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

  return useMutation<AuthTokensResponse, Error, VerifyEmailPayload>({
    mutationFn: (payload: VerifyEmailPayload) => verifyStoreEmail(payload),
    onSuccess: async (tokens) => {
      await finalizeStoreLogin(authStore, queryClient, tokens)
    },
  })
}

export function useStoreResendVerificationMutation() {
  return useMutation<ResendVerificationResponse, Error, string>({
    mutationFn: (email: string) => resendStoreVerification(email),
  })
}
