import type { ProcessServerConfigFunction } from 'filepond'
import {
  uploadAdminBrandLogo,
  uploadAdminCategoryImage,
} from '~/api/admin-catalog.api'
import type { CatalogBrand, CatalogCategory } from '~/types/admin-catalog'
import type { FilePondCustomServer } from '~/utils/filepond/product-image-upload-server'
import { toUploadFile } from '~/utils/filepond/to-upload-file'

export type CatalogAssetKind = 'category-image' | 'brand-logo'

export type CatalogAssetUploadServerOptions = {
  kind: CatalogAssetKind
  entityId: string
  onUploadStart?: () => void
  onUploadEnd?: () => void
  onUploaded: (url: string | null) => void
  onError: (error: unknown) => void
}

export type DeferredCatalogAssetUploadServerOptions = {
  onFileReady: (file: File) => void
  onFileRemoved: () => void
}

export function createCatalogAssetUploadServer(
  options: CatalogAssetUploadServerOptions,
): FilePondCustomServer {
  const process: ProcessServerConfigFunction = (
    _fieldName,
    file,
    _metadata,
    load,
    error,
  ) => {
    options.onUploadStart?.()

    const uploadFile = toUploadFile(file)
    const uploadPromise =
      options.kind === 'category-image'
        ? uploadAdminCategoryImage(options.entityId, uploadFile)
        : uploadAdminBrandLogo(options.entityId, uploadFile)

    uploadPromise
      .then((result) => {
        const url =
          options.kind === 'category-image'
            ? (result as CatalogCategory).imageUrl
            : (result as CatalogBrand).logoUrl
        options.onUploaded(url)
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

export function createDeferredCatalogAssetUploadServer(
  options: DeferredCatalogAssetUploadServerOptions,
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
