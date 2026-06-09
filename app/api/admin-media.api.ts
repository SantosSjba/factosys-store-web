import type { ListMediaParams, MediaAsset } from '~/types/admin-media'
import type { PaginatedResponse } from '~/types/pagination'

export async function fetchAdminMedia(params: ListMediaParams = {}) {
  const { data } = await useAdminApi().get<PaginatedResponse<MediaAsset>>(
    '/admin/media',
    { params: { page: 1, limit: 24, ...params } },
  )
  return data
}

export async function uploadAdminMedia(file: File, folder?: string) {
  const formData = new FormData()
  formData.append('file', file)

  const { data } = await useAdminApi().post<MediaAsset>(
    '/admin/media/upload',
    formData,
    {
      params: folder ? { folder } : undefined,
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  )
  return data
}

export async function deleteAdminMedia(id: string) {
  const { data } = await useAdminApi().delete<{ deleted: boolean }>(
    `/admin/media/${id}`,
  )
  return data
}
