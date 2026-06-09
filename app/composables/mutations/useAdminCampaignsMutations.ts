import { useMutation, useQueryClient } from '@tanstack/vue-query'
import {
  createAdminCampaign,
  deleteAdminCampaign,
  updateAdminCampaign,
} from '~/api/admin-campaigns.api'
import { adminQueryKeys } from '~/constants/query-keys'
import type { CreateCampaignPayload, UpdateCampaignPayload } from '~/types/admin-campaigns'

export function useAdminCreateCampaignMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateCampaignPayload) => createAdminCampaign(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminQueryKeys.campaigns() }),
  })
}

export function useAdminUpdateCampaignMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCampaignPayload }) =>
      updateAdminCampaign(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminQueryKeys.campaigns() }),
  })
}

export function useAdminDeleteCampaignMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteAdminCampaign(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminQueryKeys.campaigns() }),
  })
}
