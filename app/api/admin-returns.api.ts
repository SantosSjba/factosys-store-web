import type {
  CreateReturnPayload,
  ListReturnsParams,
  ReturnRequestSummary,
  UpdateReturnStatusPayload,
} from '~/types/admin-returns'
import type { PaginatedResponse } from '~/types/pagination'

export async function fetchAdminReturns(params: ListReturnsParams = {}) {
  const { data } = await useAdminApi().get<PaginatedResponse<ReturnRequestSummary>>(
    '/admin/returns',
    { params: { page: 1, limit: 10, ...params } },
  )
  return data
}

export async function fetchAdminReturn(id: string) {
  const { data } = await useAdminApi().get<ReturnRequestSummary>(`/admin/returns/${id}`)
  return data
}

export async function createAdminReturn(payload: CreateReturnPayload) {
  const { data } = await useAdminApi().post<ReturnRequestSummary>('/admin/returns', payload)
  return data
}

export async function updateAdminReturnStatus(id: string, payload: UpdateReturnStatusPayload) {
  const { data } = await useAdminApi().patch<ReturnRequestSummary>(
    `/admin/returns/${id}/status`,
    payload,
  )
  return data
}
