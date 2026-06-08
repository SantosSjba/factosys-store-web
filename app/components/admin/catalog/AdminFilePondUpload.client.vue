<script setup lang="ts">
import vueFilePond from 'vue-filepond'
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import type { CatalogProductImage } from '~/types/admin-catalog'
import { createProductImageUploadServer } from '~/utils/filepond/product-image-upload-server'

import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'

const FilePond = vueFilePond(
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType,
  FilePondPluginFileValidateSize,
)

const props = withDefaults(
  defineProps<{
    productId: string
    label?: string
    disabled?: boolean
    allowMultiple?: boolean
    markAsPrimary?: boolean
  }>(),
  {
    allowMultiple: false,
    markAsPrimary: false,
  },
)

const emit = defineEmits<{
  uploaded: [image: CatalogProductImage]
}>()

const toast = useToast()
const pondKey = ref(0)
const uploadedCount = ref(0)

const server = computed(() =>
  createProductImageUploadServer({
    productId: props.productId,
    markAsPrimary: props.markAsPrimary,
    getUploadedCount: () => uploadedCount.value,
    onUploadedCountChange: (count) => {
      uploadedCount.value = count
    },
    onUploaded: (image) => {
      emit('uploaded', image)
    },
    onError: (error) => {
      toast.error(useApiErrorMessage(error))
    },
  }),
)

watch(
  () => props.productId,
  () => {
    uploadedCount.value = 0
    pondKey.value += 1
  },
)
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
      label-idle="Arrastra imágenes o <span class='filepond--label-action'>selecciona</span>"
      accepted-file-types="image/jpeg, image/png, image/webp, image/gif"
      max-file-size="5MB"
      :allow-multiple="allowMultiple"
      credits="false"
    />
    <p class="text-admin-muted text-xs">
      JPG, PNG, WebP o GIF. Máximo 5 MB por archivo. Se guardan en MinIO/S3.
    </p>
  </div>
</template>

<style>
.filepond--panel-root {
  background-color: var(--admin-surface, #f8fafc);
  border-radius: 0.75rem;
}
</style>
