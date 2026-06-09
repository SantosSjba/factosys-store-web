<script setup lang="ts">
import { useQueryClient } from '@tanstack/vue-query'
import vueFilePond from 'vue-filepond'
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import { adminQueryKeys } from '~/constants/query-keys'
import { createMediaAssetUploadServer } from '~/utils/filepond/media-asset-upload-server'

import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'

const FilePond = vueFilePond(
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType,
  FilePondPluginFileValidateSize,
)

const props = defineProps<{
  folder?: string
  disabled?: boolean
}>()

const toast = useToast()
const queryClient = useQueryClient()
const pondKey = ref(0)
const isUploading = ref(false)

const server = computed(() =>
  createMediaAssetUploadServer({
    folder: props.folder,
    onUploadStart: () => {
      isUploading.value = true
    },
    onUploadEnd: () => {
      isUploading.value = false
    },
    onUploaded: () => {
      pondKey.value += 1
      toast.success('Archivo subido a la biblioteca')
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.media() })
    },
    onError: (error) => {
      toast.error(useApiErrorMessage(error))
    },
  }),
)
</script>

<template>
  <UiOverlayLoader :loading="isUploading" label="Subiendo archivo" rounded="xl">
    <FilePond
      :key="pondKey"
      :server="server"
      :disabled="disabled || isUploading"
      label-idle="Arrastra archivos o <span class='filepond--label-action'>selecciona</span>"
      accepted-file-types="image/jpeg, image/png, image/webp, image/gif, application/pdf"
      max-file-size="10MB"
      :allow-multiple="false"
      :max-files="1"
      credits="false"
    />
    <p class="text-admin-muted mt-2 text-xs">
      Imágenes o PDF. Máximo 10 MB.
    </p>
  </UiOverlayLoader>
</template>

<style>
.filepond--panel-root {
  background-color: var(--admin-surface, #f8fafc);
  border-radius: 0.75rem;
}
</style>
