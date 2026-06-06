import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { updateAdminRolePermissions } from '~/api/admin-roles.api'
import { adminQueryKeys } from '~/constants/query-keys'
import type { UpdateRolePermissionsPayload } from '~/types/admin-users'

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
