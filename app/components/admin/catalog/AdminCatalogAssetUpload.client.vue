<script setup lang="ts">
import vueFilePond from 'vue-filepond'
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import {
  createCatalogAssetUploadServer,
  createDeferredCatalogAssetUploadServer,
  type CatalogAssetKind,
} from '~/utils/filepond/catalog-asset-upload-server'

import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'

const FilePond = vueFilePond(
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType,
  FilePondPluginFileValidateSize,
)

const props = defineProps<{
  kind: CatalogAssetKind
  entityId?: string
  imageUrl?: string | null
  disabled?: boolean
}>()

const pendingFile = defineModel<File | null>('pendingFile', { default: null })

const toast = useToast()
const pondKey = ref(0)
const currentUrl = ref<string | null>(props.imageUrl ?? null)
const isUploading = ref(false)

const deleteCategoryMutation = useAdminDeleteCategoryImageMutation()
const deleteBrandMutation = useAdminDeleteBrandLogoMutation()

const isDeferred = computed(() => !props.entityId)
const isDeleting = computed(
  () => deleteCategoryMutation.isPending.value || deleteBrandMutation.isPending.value,
)
const isBusy = computed(() => isUploading.value || isDeleting.value)

const assetLabel = computed(() =>
  props.kind === 'category-image' ? 'Imagen de categoría' : 'Logo de marca',
)

const uploadBusyLabel = computed(() =>
  props.kind === 'category-image' ? 'Subiendo imagen' : 'Subiendo logo',
)

const deleteBusyLabel = computed(() =>
  props.kind === 'category-image' ? 'Eliminando imagen' : 'Eliminando logo',
)

const busyLabel = computed(() => {
  if (isUploading.value) return uploadBusyLabel.value
  if (isDeleting.value) return deleteBusyLabel.value
  return undefined
})

const successUploadMessage = computed(() =>
  props.kind === 'category-image' ? 'Imagen actualizada' : 'Logo actualizado',
)

const successDeleteMessage = computed(() =>
  props.kind === 'category-image' ? 'Imagen eliminada' : 'Logo eliminado',
)

const deferredReadyMessage = computed(() =>
  props.kind === 'category-image'
    ? 'Imagen lista. Se subirá al guardar.'
    : 'Logo listo. Se subirá al guardar.',
)

const server = computed(() => {
  if (isDeferred.value) {
    return createDeferredCatalogAssetUploadServer({
      onFileReady: (file) => {
        pendingFile.value = file
        toast.success(deferredReadyMessage.value)
      },
      onFileRemoved: () => {
        pendingFile.value = null
      },
    })
  }

  return createCatalogAssetUploadServer({
    kind: props.kind,
    entityId: props.entityId!,
    onUploadStart: () => {
      isUploading.value = true
    },
    onUploadEnd: () => {
      isUploading.value = false
    },
    onUploaded: (url) => {
      currentUrl.value = url
      pondKey.value += 1
      toast.success(successUploadMessage.value)
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
  () => props.entityId,
  () => {
    pondKey.value += 1
  },
)

watch(pendingFile, (file) => {
  if (isDeferred.value && !file) {
    pondKey.value += 1
  }
})

async function removeCurrentAsset() {
  if (props.disabled || isBusy.value || !currentUrl.value || !props.entityId) {
    return
  }

  try {
    if (props.kind === 'category-image') {
      await deleteCategoryMutation.mutateAsync(props.entityId)
    } else {
      await deleteBrandMutation.mutateAsync(props.entityId)
    }

    currentUrl.value = null
    pondKey.value += 1
    toast.success(successDeleteMessage.value)
  } catch (error) {
    toast.error(useApiErrorMessage(error))
  }
}
</script>

<template>
  <UiOverlayLoader :loading="isBusy" :label="busyLabel" rounded="xl">
    <div class="space-y-3">
      <div
        v-if="currentUrl && !isDeferred"
        class="border-admin-line relative max-w-xs overflow-hidden rounded-xl border"
      >
        <img
          :src="currentUrl"
          :alt="assetLabel"
          class="aspect-[4/3] w-full object-cover"
          :class="{ 'opacity-50': isBusy }"
        />
        <div class="absolute right-2 top-2">
          <UiButton
            type="button"
            size="sm"
            variant="secondary"
            :disabled="disabled || isBusy"
            @click="removeCurrentAsset"
          >
            <UiIcon name="lucide:trash-2" :size="14" class="mr-1.5" />
            Eliminar
          </UiButton>
        </div>
      </div>

      <FilePond
        :key="pondKey"
        :server="server"
        :disabled="disabled || isBusy"
        label-idle="Arrastra una imagen o <span class='filepond--label-action'>selecciona</span>"
        accepted-file-types="image/jpeg, image/png, image/webp, image/gif"
        max-file-size="5MB"
        :allow-multiple="false"
        :max-files="1"
        credits="false"
      />

      <p class="text-admin-muted text-xs">
        JPG, PNG, WebP o GIF. Máximo 5 MB por archivo. Se guardan en MinIO/S3.
        <span v-if="isDeferred"> Se subirá al guardar.</span>
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
