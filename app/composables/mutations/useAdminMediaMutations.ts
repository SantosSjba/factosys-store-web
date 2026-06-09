import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { deleteAdminMedia, uploadAdminMedia } from '~/api/admin-media.api'
import { adminQueryKeys } from '~/constants/query-keys'

export function useAdminUploadMediaMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ file, folder }: { file: File; folder?: string }) =>
      uploadAdminMedia(file, folder),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.media() })
    },
  })
}

export function useAdminDeleteMediaMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteAdminMedia(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.media() })
    },
  })
}
