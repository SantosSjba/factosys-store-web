import type {
  AdminBanner,
  CreateBannerPayload,
  UpdateBannerPayload,
} from '~/types/admin-banners'
import type { PaginatedResponse, PaginationParams } from '~/types/pagination'

export async function fetchAdminBanners(params: PaginationParams = {}) {
  const { data } = await useAdminApi().get<PaginatedResponse<AdminBanner>>(
    '/admin/banners',
    { params },
  )
  return data
}

export async function createAdminBanner(payload: CreateBannerPayload) {
  const { data } = await useAdminApi().post<AdminBanner>('/admin/banners', payload)
  return data
}

export async function updateAdminBanner(id: string, payload: UpdateBannerPayload) {
  const { data } = await useAdminApi().patch<AdminBanner>(
    `/admin/banners/${id}`,
    payload,
  )
  return data
}

export async function deleteAdminBanner(id: string) {
  const { data } = await useAdminApi().delete<{ message: string }>(
    `/admin/banners/${id}`,
  )
  return data
}

export async function uploadAdminBannerImage(bannerId: string, file: File) {
  const formData = new FormData()
  formData.append('file', file)
  const { data } = await useAdminApi().post<AdminBanner>(
    `/admin/banners/${bannerId}/image`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  )
  return data
}
