<script setup lang="ts">
import type { CatalogProductImage } from '~/types/admin-catalog'

const props = defineProps<{
  productId: string
  canWrite?: boolean
}>()

const productIdRef = computed(() => props.productId)
const { data: product, isPending } = useAdminProductQuery(productIdRef)
const deleteMutation = useAdminDeleteProductImageMutation()

const images = computed(() =>
  [...(product.value?.images ?? [])].sort((a, b) => a.sortOrder - b.sortOrder),
)

function removeImage(image: CatalogProductImage) {
  return runAdminSuspendAction({
    confirm: {
      title: 'Eliminar imagen',
      message: '¿Quitar esta imagen del producto?',
      confirmLabel: 'Eliminar',
    },
    mutate: () =>
      deleteMutation.mutateAsync({ productId: props.productId, imageId: image.id }),
    successMessage: 'Imagen eliminada',
  })
}
</script>

<template>
  <div class="space-y-4">
    <div v-if="isPending" class="text-admin-muted text-sm">Cargando imágenes…</div>

    <div
      v-else-if="images.length"
      class="grid grid-cols-2 gap-3 sm:grid-cols-3"
    >
      <div
        v-for="image in images"
        :key="image.id"
        class="border-admin-line group relative overflow-hidden rounded-lg border"
      >
        <img
          :src="image.url"
          :alt="image.alt || 'Imagen del producto'"
          class="aspect-square w-full object-cover"
        />
        <div
          v-if="image.isPrimary"
          class="bg-brand-accent/90 absolute left-2 top-2 rounded px-2 py-0.5 text-[10px] font-medium uppercase text-white"
        >
          Principal
        </div>
        <UiIconButton
          v-if="canWrite"
          icon="lucide:trash-2"
          ariaLabel="Eliminar imagen"
          class="absolute right-2 top-2 opacity-0 transition group-hover:opacity-100"
          @click="removeImage(image)"
        />
      </div>
    </div>

    <UiEmptyState
      v-else
      title="Sin imágenes"
      description="Sube la primera imagen del producto."
      class="py-6"
    />

    <AdminFilePondUpload
      v-if="canWrite"
      :product-id="productId"
      label="Subir imagen"
    />
  </div>
</template>
