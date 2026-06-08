import type {
  FilePondServerConfigProps,
  ProcessServerConfigFunction,
} from 'filepond'
import { uploadAdminProductImage } from '~/api/admin-catalog.api'
import type { CatalogProductImage } from '~/types/admin-catalog'
import { toUploadFile } from '~/utils/filepond/to-upload-file'

export type FilePondCustomServer = Exclude<
  NonNullable<FilePondServerConfigProps['server']>,
  string
>

export type ProductImageUploadServerOptions = {
  productId: string
  markAsPrimary: boolean
  getUploadedCount: () => number
  onUploadedCountChange: (count: number) => void
  onUploaded: (image: CatalogProductImage) => void
  onError: (error: unknown) => void
}

export function createProductImageUploadServer(
  options: ProductImageUploadServerOptions,
): FilePondCustomServer {
  const process: ProcessServerConfigFunction = (
    _fieldName,
    file,
    _metadata,
    load,
    error,
    _progress,
    _abort,
  ) => {
    const shouldBePrimary =
      options.markAsPrimary && options.getUploadedCount() === 0

    uploadAdminProductImage(options.productId, toUploadFile(file), {
      isPrimary: shouldBePrimary,
    })
      .then((image) => {
        options.onUploadedCountChange(options.getUploadedCount() + 1)
        options.onUploaded(image)
        load(image.id)
      })
      .catch((err: unknown) => {
        options.onError(err)
        error(
          err instanceof Error ? err.message : 'No se pudo subir la imagen',
        )
      })
  }

  return { process }
}
