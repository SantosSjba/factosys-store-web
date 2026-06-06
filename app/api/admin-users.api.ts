import type {
  CreateStaffUserPayload,
  StaffUser,
  UpdateStaffUserPayload,
} from '~/types/admin-users'
import type { PaginatedResponse, PaginationParams } from '~/types/pagination'

export async function fetchAdminStaffUsers(params: PaginationParams = {}) {
  const { data } = await useAdminApi().get<PaginatedResponse<StaffUser>>(
    '/admin/users',
    { params },
  )
  return data
}

export async function fetchAdminStaffUser(id: string) {
  const { data } = await useAdminApi().get<StaffUser>(`/admin/users/${id}`)
  return data
}

export async function createAdminStaffUser(payload: CreateStaffUserPayload) {
  const { data } = await useAdminApi().post<StaffUser>('/admin/users', payload)
  return data
}

export async function updateAdminStaffUser(
  id: string,
  payload: UpdateStaffUserPayload,
) {
  const { data } = await useAdminApi().patch<StaffUser>(
    `/admin/users/${id}`,
    payload,
  )
  return data
}

export async function softDeleteAdminStaffUser(id: string) {
  const { data } = await useAdminApi().delete<StaffUser>(`/admin/users/${id}`)
  return data
}
