import type { ProcessServerConfigFunction } from 'filepond'
import {
  deleteAdminCompanyLogo,
  deleteAdminStoreFavicon,
  deleteAdminStoreLogo,
  uploadAdminCompanyLogo,
  uploadAdminStoreFavicon,
  uploadAdminStoreLogo,
} from '~/api/admin-settings.api'
import type { CompanyProfile, StoreSettings } from '~/types/admin-settings'
import type { FilePondCustomServer } from '~/utils/filepond/product-image-upload-server'
import { toUploadFile } from '~/utils/filepond/to-upload-file'

export type SettingsAssetKind = 'company-logo' | 'store-logo' | 'store-favicon'

export type SettingsAssetUploadServerOptions = {
  kind: SettingsAssetKind
  onUploadStart?: () => void
  onUploadEnd?: () => void
  onUploaded: (url: string | null) => void
  onError: (error: unknown) => void
}

export function createSettingsAssetUploadServer(
  options: SettingsAssetUploadServerOptions,
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
      options.kind === 'company-logo'
        ? uploadAdminCompanyLogo(uploadFile)
        : options.kind === 'store-logo'
          ? uploadAdminStoreLogo(uploadFile)
          : uploadAdminStoreFavicon(uploadFile)

    uploadPromise
      .then((result) => {
        const url =
          options.kind === 'company-logo'
            ? (result as CompanyProfile).logoUrl
            : options.kind === 'store-logo'
              ? (result as StoreSettings).logoUrl
              : (result as StoreSettings).faviconUrl
        options.onUploaded(url)
        load('done')
      })
      .catch((err: unknown) => {
        options.onError(err)
        error(err instanceof Error ? err.message : 'No se pudo subir la imagen')
      })
      .finally(() => {
        options.onUploadEnd?.()
      })
  }

  return { process }
}

export async function deleteSettingsAsset(kind: SettingsAssetKind) {
  if (kind === 'company-logo') return deleteAdminCompanyLogo()
  if (kind === 'store-logo') return deleteAdminStoreLogo()
  return deleteAdminStoreFavicon()
}
