<script setup lang="ts">
import vueFilePond from 'vue-filepond'
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import type { FilePondServerConfigProps } from 'filepond'
import { uploadAdminProductImage } from '~/api/admin-catalog.api'
import type { CatalogProductImage } from '~/types/admin-catalog'

import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'

const FilePond = vueFilePond(
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType,
  FilePondPluginFileValidateSize,
)

const props = defineProps<{
  productId: string
  label?: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  uploaded: [image: CatalogProductImage]
}>()

const toast = useToast()
const pondKey = ref(0)

const server: FilePondServerConfigProps = {
  process: (
    _fieldName,
    file,
    _metadata,
    load,
    error,
    _progress,
    _abort,
  ) => {
    uploadAdminProductImage(props.productId, file as File)
      .then((image) => {
        emit('uploaded', image)
        toast.success('Imagen subida correctamente')
        load(image.id)
        pondKey.value += 1
      })
      .catch((err: unknown) => {
        const message = useApiErrorMessage(err)
        toast.error(message)
        error(message)
      })
  },
}
</script>

<template>
  <div class="space-y-2">
    <p v-if="label" class="text-admin-muted text-xs font-medium uppercase">
      {{ label }}
    </p>
    <FilePond
      :key="pondKey"
      :server="server"
      :disabled="disabled"
      label-idle="Arrastra una imagen o <span class='filepond--label-action'>selecciona</span>"
      accepted-file-types="image/jpeg, image/png, image/webp, image/gif"
      max-file-size="5MB"
      :allow-multiple="false"
      credits="false"
    />
    <p class="text-admin-muted text-xs">
      JPG, PNG, WebP o GIF. Máximo 5 MB. Se guarda en MinIO/S3.
    </p>
  </div>
</template>

<style>
.filepond--panel-root {
  background-color: var(--admin-surface, #f8fafc);
  border-radius: 0.75rem;
}
</style>
