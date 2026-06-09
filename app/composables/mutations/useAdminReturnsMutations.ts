import { useMutation, useQueryClient } from '@tanstack/vue-query'
import {
  createAdminReturn,
  updateAdminReturnStatus,
} from '~/api/admin-returns.api'
import { adminQueryKeys } from '~/constants/query-keys'
import type { CreateReturnPayload, UpdateReturnStatusPayload } from '~/types/admin-returns'

function invalidateReturns(queryClient: ReturnType<typeof useQueryClient>, id?: string) {
  queryClient.invalidateQueries({ queryKey: adminQueryKeys.returns() })
  if (id) {
    queryClient.invalidateQueries({ queryKey: adminQueryKeys.return(id) })
  }
}

export function useAdminCreateReturnMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateReturnPayload) => createAdminReturn(payload),
    onSuccess: (item) => invalidateReturns(queryClient, item.id),
  })
}

export function useAdminUpdateReturnStatusMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateReturnStatusPayload }) =>
      updateAdminReturnStatus(id, payload),
    onSuccess: (item) => invalidateReturns(queryClient, item.id),
  })
}
