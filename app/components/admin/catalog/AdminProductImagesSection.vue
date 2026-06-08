<script setup lang="ts">
import { VueDraggable } from 'vue-draggable-plus'
import type { CatalogProductImage } from '~/types/admin-catalog'

type ImageBusyAction = 'reorder' | 'primary' | 'delete'

const props = defineProps<{
  productId: string
  canWrite?: boolean
}>()

const toast = useToast()
const productIdRef = computed(() => props.productId)
const { data: product, isPending } = useAdminProductQuery(productIdRef)
const { addImage, replaceImages } = useAdminProductImageCache(productIdRef)

const deleteMutation = useAdminDeleteProductImageMutation()
const primaryMutation = useAdminSetProductImagePrimaryMutation()
const reorderMutation = useAdminReorderProductImagesMutation()

const isDeletingImage = computed(() => deleteMutation.isPending.value)
const isSettingPrimary = computed(() => primaryMutation.isPending.value)
const isReorderingImages = computed(() => reorderMutation.isPending.value)

const pendingImageId = ref<string | null>(null)
const pendingAction = ref<ImageBusyAction | null>(null)
const pendingPrimaryIntent = ref<'set' | 'unset' | null>(null)
const orderBeforeDrag = ref<string[]>([])

const images = computed(() =>
  [...(product.value?.images ?? [])].sort((a, b) => a.sortOrder - b.sortOrder),
)

const orderedImages = ref<CatalogProductImage[]>([])

watch(
  images,
  (next) => {
    if (isReorderingImages.value) return
    orderedImages.value = [...next]
  },
  { immediate: true, deep: true },
)

const dragDisabled = computed(
  () => !props.canWrite || isReorderingImages.value || isPending.value,
)

function isImageBusy(imageId: string) {
  return pendingImageId.value === imageId
}

function busyLabel(imageId: string) {
  if (!isImageBusy(imageId) || !pendingAction.value) return undefined

  if (pendingAction.value === 'primary') {
    return pendingPrimaryIntent.value === 'unset'
      ? 'Quitando principal'
      : 'Marcando principal'
  }

  const labels: Record<Exclude<ImageBusyAction, 'primary'>, string> = {
    reorder: 'Reordenando',
    delete: 'Eliminando',
  }

  return labels[pendingAction.value]
}

function beginImageAction(imageId: string, action: ImageBusyAction) {
  pendingImageId.value = imageId
  pendingAction.value = action
}

function endImageAction() {
  pendingImageId.value = null
  pendingAction.value = null
  pendingPrimaryIntent.value = null
}

function onReorderStart() {
  orderBeforeDrag.value = orderedImages.value.map((image) => image.id)
}

function findMovedImageId(before: string[], after: string[]) {
  for (const id of after) {
    if (before.indexOf(id) !== after.indexOf(id)) {
      return id
    }
  }
  return after[0] ?? null
}

async function onReorderEnd() {
  const afterIds = orderedImages.value.map((image) => image.id)
  const beforeIds = orderBeforeDrag.value

  if (beforeIds.join(',') === afterIds.join(',')) return

  const movedId = findMovedImageId(beforeIds, afterIds)
  if (!movedId) return

  beginImageAction(movedId, 'reorder')

  try {
    const updated = await reorderMutation.mutateAsync({
      productId: props.productId,
      imageIds: afterIds,
    })
    replaceImages(updated)
  } catch (error) {
    orderedImages.value = [...images.value]
    toast.error(useApiErrorMessage(error))
  } finally {
    endImageAction()
    orderBeforeDrag.value = []
  }
}

function onImageUploaded(image: CatalogProductImage) {
  addImage(image)
  toast.success('Imagen subida correctamente')
}

function removeImage(image: CatalogProductImage) {
  return runAdminSuspendAction({
    confirm: {
      title: 'Eliminar imagen',
      message: '¿Quitar esta imagen del producto?',
      confirmLabel: 'Eliminar',
    },
    mutate: async () => {
      beginImageAction(image.id, 'delete')
      try {
        await deleteMutation.mutateAsync({
          productId: props.productId,
          imageId: image.id,
        })
      } finally {
        endImageAction()
      }
    },
    successMessage: 'Imagen eliminada',
  })
}

async function togglePrimary(image: CatalogProductImage) {
  if (isSettingPrimary.value) return

  const nextIsPrimary = !image.isPrimary
  pendingPrimaryIntent.value = nextIsPrimary ? 'set' : 'unset'
  beginImageAction(image.id, 'primary')

  try {
    const updated = await primaryMutation.mutateAsync({
      productId: props.productId,
      imageId: image.id,
      isPrimary: nextIsPrimary,
    })

    const nextImages = images.value.map((entry) => {
      if (entry.id === updated.id) {
        return { ...entry, isPrimary: updated.isPrimary }
      }
      return nextIsPrimary
        ? { ...entry, isPrimary: false }
        : entry
    })

    replaceImages(nextImages)
    toast.success(
      nextIsPrimary
        ? 'Imagen principal actualizada'
        : 'Imagen ya no es la principal',
    )
  } catch (error) {
    toast.error(useApiErrorMessage(error))
  } finally {
    endImageAction()
  }
}
</script>

<template>
  <div class="space-y-4">
    <UiOverlayLoader :loading="isPending" label="Cargando imágenes" rounded="lg">
      <div class="min-h-[4rem] space-y-4">
        <ClientOnly>
          <VueDraggable
            v-if="orderedImages.length"
            v-model="orderedImages"
            tag="div"
            class="grid grid-cols-2 gap-3 sm:grid-cols-3"
            handle=".gallery-drag-handle"
            :animation="220"
            :disabled="dragDisabled"
            ghost-class="gallery-sortable-ghost"
            chosen-class="gallery-sortable-chosen"
            drag-class="gallery-sortable-drag"
            :force-fallback="false"
            @start="onReorderStart"
            @end="onReorderEnd"
          >
            <UiOverlayLoader
              v-for="image in orderedImages"
              :key="image.id"
              :loading="isImageBusy(image.id)"
              :label="busyLabel(image.id)"
              rounded="lg"
            >
              <div class="border-admin-line group relative overflow-hidden rounded-lg border">
                <img
                  :src="image.url"
                  :alt="image.alt || 'Imagen del producto'"
                  class="aspect-square w-full object-cover"
                  :class="{ 'opacity-60': isImageBusy(image.id) }"
                  draggable="false"
                />

                <button
                  v-if="canWrite"
                  type="button"
                  class="gallery-drag-handle absolute left-2 top-2 flex cursor-grab items-center rounded bg-black/55 p-1 text-white opacity-0 transition active:cursor-grabbing group-hover:opacity-100"
                  :class="{ 'pointer-events-none opacity-0': isImageBusy(image.id) }"
                  aria-label="Arrastrar para reordenar"
                >
                  <UiIcon name="lucide:grip-vertical" :size="16" />
                </button>

                <div
                  v-if="image.isPrimary"
                  class="bg-brand-accent/90 absolute right-2 top-2 rounded px-2 py-0.5 text-[10px] font-medium uppercase text-white"
                >
                  Principal
                </div>

                <div
                  v-if="canWrite"
                  class="absolute inset-x-0 bottom-0 flex items-center justify-end gap-1 bg-black/55 p-2 opacity-0 transition group-hover:opacity-100"
                  :class="{ 'pointer-events-none opacity-0': isImageBusy(image.id) }"
                >
                  <UiIconButton
                    icon="lucide:star"
                    :ariaLabel="
                      image.isPrimary
                        ? 'Quitar como principal'
                        : 'Marcar como principal'
                    "
                    size="sm"
                    :class="
                      image.isPrimary
                        ? '!text-amber-300'
                        : '!text-white hover:!bg-white/15'
                    "
                    :disabled="isSettingPrimary"
                    @click="togglePrimary(image)"
                  />
                  <UiIconButton
                    icon="lucide:trash-2"
                    ariaLabel="Eliminar imagen"
                    size="sm"
                    class="!text-white hover:!bg-white/15"
                    :disabled="isDeletingImage"
                    @click="removeImage(image)"
                  />
                </div>
              </div>
            </UiOverlayLoader>
          </VueDraggable>

          <template #fallback>
            <div
              v-if="orderedImages.length"
              class="grid grid-cols-2 gap-3 sm:grid-cols-3"
            >
              <div
                v-for="image in orderedImages"
                :key="image.id"
                class="border-admin-line aspect-square overflow-hidden rounded-lg border"
              >
                <img
                  :src="image.url"
                  :alt="image.alt || 'Imagen del producto'"
                  class="h-full w-full object-cover"
                />
              </div>
            </div>
          </template>
        </ClientOnly>

        <UiEmptyState
          v-if="!orderedImages.length && !isPending"
          title="Sin imágenes"
          description="Sube la primera imagen del producto. La primera se marcará como principal automáticamente."
          class="py-6"
        />

        <AdminFilePondUpload
          v-if="canWrite && !isPending"
          :product-id="productId"
          label="Subir imágenes"
          :allow-multiple="true"
          :mark-as-primary="images.length === 0"
          @uploaded="onImageUploaded"
        />

        <p v-if="orderedImages.length && !isPending" class="text-admin-muted text-xs">
          {{ orderedImages.length }} imagen{{ orderedImages.length === 1 ? '' : 'es' }}.
          Arrastra con el asa superior para reordenar. Si no hay principal, el listado usa la primera por orden.
        </p>
      </div>
    </UiOverlayLoader>
  </div>
</template>

<style scoped>
:deep(.gallery-sortable-ghost) {
  opacity: 0.45;
}

:deep(.gallery-sortable-chosen) {
  box-shadow: 0 0 0 2px var(--brand-accent, #0ea5e9);
  border-radius: 0.5rem;
}

:deep(.gallery-sortable-drag) {
  cursor: grabbing;
}
</style>
