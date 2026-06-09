<script setup lang="ts">
import type { MediaAsset } from '~/types/admin-media'

const { can } = useAdminPermissions()
const deleteMutation = useAdminDeleteMediaMutation()

const page = ref(1)
const search = ref('')
const folder = ref('')

const queryParams = computed(() => ({
  page: page.value,
  limit: 24,
  search: search.value.trim() || undefined,
  folder: folder.value.trim() || undefined,
}))

const { data, isPending } = useAdminMediaQuery(queryParams)

const assets = computed(() => data.value?.items ?? [])
const paginationMeta = computed(() => data.value?.meta)

watch([search, folder], () => {
  page.value = 1
})

function isImage(asset: MediaAsset) {
  return asset.mimeType.startsWith('image/')
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function removeAsset(asset: MediaAsset) {
  return runAdminSuspendAction({
    confirm: {
      title: 'Eliminar archivo',
      message: `¿Eliminar "${asset.fileName}" de la biblioteca?`,
      confirmLabel: 'Eliminar',
    },
    mutate: () => deleteMutation.mutateAsync(asset.id),
    successMessage: 'Archivo eliminado',
  })
}
</script>

<template>
  <div class="space-y-4">
    <AdminCard v-if="can('media.write')" title="Subir archivo" icon="lucide:upload">
      <AdminMediaAssetUpload :folder="folder || undefined" />
    </AdminCard>

    <UiFilterBar title="Biblioteca">
      <UiSearchInput
        v-model="search"
        placeholder="Buscar por nombre…"
        class="min-w-[16rem] flex-1"
      />
      <UiInput v-model="folder" label="Carpeta" placeholder="media-library" class="w-44" />
    </UiFilterBar>

    <div v-if="isPending && !assets.length" class="text-admin-muted flex items-center gap-2 text-sm">
      <UiSpinner size="sm" />
      Cargando medios…
    </div>

    <div v-else-if="!assets.length" class="py-8">
      <UiEmptyState
        title="Sin archivos"
        description="Sube imágenes o documentos a la biblioteca de medios."
      />
    </div>

    <div v-else class="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <div
        v-for="asset in assets"
        :key="asset.id"
        class="border-admin-line group relative overflow-hidden rounded-xl border bg-white"
      >
        <div class="bg-admin-surface aspect-square flex items-center justify-center overflow-hidden">
          <img
            v-if="isImage(asset)"
            :src="asset.url"
            :alt="asset.fileName"
            class="h-full w-full object-cover"
          />
          <UiIcon v-else name="lucide:file-text" :size="40" class="text-admin-muted" />
        </div>
        <div class="space-y-1 p-3">
          <p class="truncate text-sm font-medium" :title="asset.fileName">{{ asset.fileName }}</p>
          <p class="text-admin-muted text-xs">
            {{ formatFileSize(asset.sizeBytes) }}
            <span v-if="asset.folder"> · {{ asset.folder }}</span>
          </p>
          <p class="text-admin-muted text-xs">{{ formatAdminDate(asset.createdAt) }}</p>
        </div>
        <div
          v-if="can('media.write')"
          class="absolute right-2 top-2 opacity-0 transition group-hover:opacity-100"
        >
          <UiIconButton
            icon="lucide:trash-2"
            ariaLabel="Eliminar"
            tone="admin"
            @click="removeAsset(asset)"
          />
        </div>
      </div>
    </div>

    <div
      v-if="paginationMeta && paginationMeta.total > 0"
      class="border-admin-line rounded-xl border px-4 py-3"
    >
      <UiPagination
        :page="paginationMeta.page"
        :page-size="paginationMeta.limit"
        :total="paginationMeta.total"
        tone="admin"
        @update:page="page = $event"
      />
    </div>
  </div>
</template>
