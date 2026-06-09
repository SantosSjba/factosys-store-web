import type {
  AdminCampaign,
  CreateCampaignPayload,
  UpdateCampaignPayload,
} from '~/types/admin-campaigns'
import type { PaginatedResponse, PaginationParams } from '~/types/pagination'

export async function fetchAdminCampaigns(params: PaginationParams = {}) {
  const { data } = await useAdminApi().get<PaginatedResponse<AdminCampaign>>(
    '/admin/campaigns',
    { params },
  )
  return data
}

export async function createAdminCampaign(payload: CreateCampaignPayload) {
  const { data } = await useAdminApi().post<AdminCampaign>(
    '/admin/campaigns',
    payload,
  )
  return data
}

export async function updateAdminCampaign(id: string, payload: UpdateCampaignPayload) {
  const { data } = await useAdminApi().patch<AdminCampaign>(
    `/admin/campaigns/${id}`,
    payload,
  )
  return data
}

export async function deleteAdminCampaign(id: string) {
  const { data } = await useAdminApi().delete<{ message: string }>(
    `/admin/campaigns/${id}`,
  )
  return data
}
