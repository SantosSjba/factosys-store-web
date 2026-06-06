import { useMutation, useQueryClient } from '@tanstack/vue-query'
import {
  createAdminStaffUser,
  softDeleteAdminStaffUser,
  updateAdminStaffUser,
} from '~/api/admin-users.api'
import { adminQueryKeys } from '~/constants/query-keys'
import type {
  CreateStaffUserPayload,
  UpdateStaffUserPayload,
} from '~/types/admin-users'

export function useAdminCreateUserMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateStaffUserPayload) => createAdminStaffUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.users() })
    },
  })
}

export function useAdminUpdateUserMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: UpdateStaffUserPayload
    }) => updateAdminStaffUser(id, payload),
    onSuccess: (user) => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.users() })
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.user(user.id) })
    },
  })
}

export function useAdminDeleteUserMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => softDeleteAdminStaffUser(id),
    onSuccess: (user) => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.users() })
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.user(user.id) })
    },
  })
}
