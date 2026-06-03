import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { loginAdminUser } from '~/api/admin-auth.api'
import { adminQueryKeys } from '~/constants/query-keys'
import type { LoginPayload } from '~/types/auth'

export function useAdminLoginMutation() {
  const adminAuth = useAdminAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: LoginPayload) => loginAdminUser(payload),
    onSuccess: (tokens) => {
      adminAuth.setSession(tokens)
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.all })
    },
  })
}
