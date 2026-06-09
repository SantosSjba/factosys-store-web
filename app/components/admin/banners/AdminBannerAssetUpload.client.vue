<script setup lang="ts">
import { useQueryClient } from '@tanstack/vue-query'
import vueFilePond from 'vue-filepond'
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import { adminQueryKeys } from '~/constants/query-keys'
import {
  createBannerAssetUploadServer,
  createDeferredBannerAssetUploadServer,
} from '~/utils/filepond/banner-asset-upload-server'

import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'

const FilePond = vueFilePond(
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType,
  FilePondPluginFileValidateSize,
)

const props = defineProps<{
  bannerId?: string
  imageUrl?: string | null
  disabled?: boolean
}>()

const pendingFile = defineModel<File | null>('pendingFile', { default: null })

const toast = useToast()
const queryClient = useQueryClient()
const pondKey = ref(0)
const currentUrl = ref<string | null>(props.imageUrl ?? null)
const isUploading = ref(false)

const isDeferred = computed(() => !props.bannerId)
const isBusy = computed(() => isUploading.value)

const server = computed(() => {
  if (isDeferred.value) {
    return createDeferredBannerAssetUploadServer({
      onFileReady: (file) => {
        pendingFile.value = file
        toast.success('Imagen lista. Se subirá al guardar.')
      },
      onFileRemoved: () => {
        pendingFile.value = null
      },
    })
  }

  return createBannerAssetUploadServer({
    bannerId: props.bannerId!,
    onUploadStart: () => {
      isUploading.value = true
    },
    onUploadEnd: () => {
      isUploading.value = false
    },
    onUploaded: (url) => {
      currentUrl.value = url
      pondKey.value += 1
      toast.success('Imagen del banner actualizada')
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.banners() })
    },
    onError: (error) => {
      toast.error(useApiErrorMessage(error))
    },
  })
})

watch(
  () => props.imageUrl,
  (url) => {
    if (isDeferred.value && pendingFile.value) return
    currentUrl.value = url ?? null
  },
)

watch(
  () => props.bannerId,
  () => {
    pondKey.value += 1
  },
)

watch(pendingFile, (file) => {
  if (isDeferred.value && !file) {
    pondKey.value += 1
  }
})
</script>

<template>
  <UiOverlayLoader :loading="isBusy" :label="isUploading ? 'Subiendo imagen' : undefined" rounded="xl">
    <div class="space-y-3">
      <div
        v-if="currentUrl && !isDeferred"
        class="border-admin-line relative max-w-md overflow-hidden rounded-xl border"
      >
        <img
          :src="currentUrl"
          alt="Imagen del banner"
          class="aspect-[16/6] w-full object-cover"
          :class="{ 'opacity-50': isBusy }"
        />
      </div>

      <FilePond
        :key="pondKey"
        :server="server"
        :disabled="disabled || isBusy"
        label-idle="Arrastra la imagen del banner o <span class='filepond--label-action'>selecciona</span>"
        accepted-file-types="image/jpeg, image/png, image/webp, image/gif"
        max-file-size="5MB"
        :allow-multiple="false"
        :max-files="1"
        credits="false"
      />

      <p class="text-admin-muted text-xs">
        JPG, PNG, WebP o GIF. Máximo 5 MB. Se guarda en MinIO/S3.
        <span v-if="isDeferred"> Se subirá al guardar el banner.</span>
      </p>
    </div>
  </UiOverlayLoader>
</template>

<style>
.filepond--panel-root {
  background-color: var(--admin-surface, #f8fafc);
  border-radius: 0.75rem;
}
</style>
