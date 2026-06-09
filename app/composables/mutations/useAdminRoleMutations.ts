import { useMutation, useQueryClient } from '@tanstack/vue-query'
import {
  createAdminRole,
  deleteAdminRole,
  updateAdminRole,
  updateAdminRolePermissions,
} from '~/api/admin-roles.api'
import { adminQueryKeys } from '~/constants/query-keys'
import type {
  CreateRolePayload,
  UpdateRolePayload,
  UpdateRolePermissionsPayload,
} from '~/types/admin-users'

export function useAdminCreateRoleMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateRolePayload) => createAdminRole(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.roles() })
    },
  })
}

export function useAdminUpdateRoleMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ slug, payload }: { slug: string; payload: UpdateRolePayload }) =>
      updateAdminRole(slug, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.roles() })
    },
  })
}

export function useAdminDeleteRoleMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (slug: string) => deleteAdminRole(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.roles() })
    },
  })
}

export function useAdminUpdateRolePermissionsMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      slug,
      payload,
    }: {
      slug: string
      payload: UpdateRolePermissionsPayload
    }) => updateAdminRolePermissions(slug, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.roles() })
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.users() })
    },
  })
}
