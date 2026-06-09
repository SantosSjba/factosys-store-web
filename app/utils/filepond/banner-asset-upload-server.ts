import type { ProcessServerConfigFunction } from 'filepond'
import { uploadAdminBannerImage } from '~/api/admin-banners.api'
import type { AdminBanner } from '~/types/admin-banners'
import type { FilePondCustomServer } from '~/utils/filepond/product-image-upload-server'
import { toUploadFile } from '~/utils/filepond/to-upload-file'

export type BannerAssetUploadServerOptions = {
  bannerId: string
  onUploadStart?: () => void
  onUploadEnd?: () => void
  onUploaded: (url: string | null) => void
  onError: (error: unknown) => void
}

export type DeferredBannerAssetUploadServerOptions = {
  onFileReady: (file: File) => void
  onFileRemoved: () => void
}

export function createBannerAssetUploadServer(
  options: BannerAssetUploadServerOptions,
): FilePondCustomServer {
  const process: ProcessServerConfigFunction = (
    _fieldName,
    file,
    _metadata,
    load,
    error,
  ) => {
    options.onUploadStart?.()

    uploadAdminBannerImage(options.bannerId, toUploadFile(file))
      .then((result: AdminBanner) => {
        options.onUploaded(result.imageUrl)
        load(result.id)
      })
      .catch((err: unknown) => {
        options.onError(err)
        error(
          err instanceof Error ? err.message : 'No se pudo subir la imagen',
        )
      })
      .finally(() => {
        options.onUploadEnd?.()
      })
  }

  return { process }
}

export function createDeferredBannerAssetUploadServer(
  options: DeferredBannerAssetUploadServerOptions,
): FilePondCustomServer {
  const process: ProcessServerConfigFunction = (
    _fieldName,
    file,
    _metadata,
    load,
  ) => {
    options.onFileReady(toUploadFile(file))
    load('pending')
  }

  return {
    process,
    revert: (_uniqueId, load) => {
      options.onFileRemoved()
      load()
    },
  }
}
