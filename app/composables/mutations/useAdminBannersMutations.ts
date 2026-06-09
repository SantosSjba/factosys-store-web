import { useMutation, useQueryClient } from '@tanstack/vue-query'
import {
  createAdminBanner,
  deleteAdminBanner,
  updateAdminBanner,
  uploadAdminBannerImage,
} from '~/api/admin-banners.api'
import { adminQueryKeys } from '~/constants/query-keys'
import type { CreateBannerPayload, UpdateBannerPayload } from '~/types/admin-banners'

export function useAdminCreateBannerMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateBannerPayload) => createAdminBanner(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminQueryKeys.banners() }),
  })
}

export function useAdminUpdateBannerMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateBannerPayload }) =>
      updateAdminBanner(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminQueryKeys.banners() }),
  })
}

export function useAdminDeleteBannerMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteAdminBanner(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminQueryKeys.banners() }),
  })
}

export function useAdminUploadBannerImageMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ bannerId, file }: { bannerId: string; file: File }) =>
      uploadAdminBannerImage(bannerId, file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminQueryKeys.banners() }),
  })
}
