<script setup lang="ts">
import { useQueryClient } from '@tanstack/vue-query'
import vueFilePond from 'vue-filepond'
import { adminQueryKeys } from '~/constants/query-keys'
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import {
  createSettingsAssetUploadServer,
  deleteSettingsAsset,
  type SettingsAssetKind,
} from '~/utils/filepond/settings-asset-upload-server'

import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'

const FilePond = vueFilePond(
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType,
  FilePondPluginFileValidateSize,
)

const props = defineProps<{
  kind: SettingsAssetKind
  imageUrl?: string | null
  disabled?: boolean
}>()

const toast = useToast()
const queryClient = useQueryClient()
const pondKey = ref(0)
const currentUrl = ref<string | null>(props.imageUrl ?? null)
const isUploading = ref(false)
const isDeleting = ref(false)

const assetLabel = computed(() => {
  if (props.kind === 'company-logo') return 'Logo de empresa'
  if (props.kind === 'store-logo') return 'Logo de tienda'
  return 'Favicon'
})

const isBusy = computed(() => isUploading.value || isDeleting.value)

watch(
  () => props.imageUrl,
  (value) => {
    currentUrl.value = value ?? null
  },
)

const server = computed(() =>
  createSettingsAssetUploadServer({
    kind: props.kind,
    onUploadStart: () => {
      isUploading.value = true
    },
    onUploadEnd: () => {
      isUploading.value = false
    },
    onUploaded: (url) => {
      currentUrl.value = url
      toast.success(`${assetLabel.value} actualizado`)
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.settingsCompany() })
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.settingsStore() })
    },
    onError: (error) => {
      toast.error(useApiErrorMessage(error))
    },
  }),
)

async function removeAsset() {
  isDeleting.value = true
  try {
    await deleteSettingsAsset(props.kind)
    currentUrl.value = null
    pondKey.value += 1
    toast.success(`${assetLabel.value} eliminado`)
    queryClient.invalidateQueries({ queryKey: adminQueryKeys.settingsCompany() })
    queryClient.invalidateQueries({ queryKey: adminQueryKeys.settingsStore() })
  } catch (error) {
    toast.error(useApiErrorMessage(error))
  } finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <div class="relative">
    <div
      v-if="isBusy"
      class="bg-admin-surface/80 absolute inset-0 z-10 flex items-center justify-center rounded-lg"
    >
      <UiSpinner size="sm" />
    </div>

    <div v-if="currentUrl" class="mb-3 flex items-center gap-3">
      <img :src="currentUrl" :alt="assetLabel" class="h-16 w-16 rounded-lg border object-contain" />
      <UiButton
        v-if="!disabled"
        size="sm"
        variant="ghost"
        :disabled="isBusy"
        @click="removeAsset"
      >
        Eliminar
      </UiButton>
    </div>

    <FilePond
      v-if="!disabled"
      :key="pondKey"
      :server="server"
      :label-idle="`Arrastra el ${assetLabel.toLowerCase()} o <span class='filepond--label-action'>explora</span>`"
      accepted-file-types="image/jpeg,image/png,image/webp,image/svg+xml"
      max-file-size="5MB"
      :disabled="isBusy"
      credits="false"
    />
  </div>
</template>
