import { uploadAdminMedia } from '~/api/admin-media.api'
import { toUploadFile } from '~/utils/filepond/to-upload-file'

export function createMediaAssetUploadServer(options: {
  folder?: string
  onUploadStart?: () => void
  onUploadEnd?: () => void
  onUploaded?: () => void
  onError?: (error: unknown) => void
}) {
  return {
    process: (
      _fieldName: string,
      file: File,
      _metadata: Record<string, unknown>,
      load: (id: string) => void,
      error: (message: string) => void,
      _progress: (computable: boolean, loaded: number, total: number) => void,
      _abort: () => void,
    ) => {
      options.onUploadStart?.()
      uploadAdminMedia(toUploadFile(file), options.folder)
        .then(() => {
          load('uploaded')
          options.onUploaded?.()
        })
        .catch((err) => {
          options.onError?.(err)
          error(useApiErrorMessage(err))
        })
        .finally(() => {
          options.onUploadEnd?.()
        })
    },
    revert: (_uniqueId: string, load: () => void) => {
      load()
    },
  }
}
