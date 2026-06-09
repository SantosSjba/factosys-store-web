<script setup lang="ts">
import type { AdminBanner, BannerPlacement } from '~/types/admin-banners'
import type { UiTableColumn } from '~/types/ui'
import { formatBannerPlacement } from '~/utils/format-banner'

const { can } = useAdminPermissions()
const createMutation = useAdminCreateBannerMutation()
const updateMutation = useAdminUpdateBannerMutation()
const deleteMutation = useAdminDeleteBannerMutation()
const uploadMutation = useAdminUploadBannerImageMutation()

const { page, search, isPending, items: banners, paginationMeta } =
  usePaginatedAdminList<AdminBanner>((params) => useAdminBannersQuery(params))

const modalOpen = ref(false)
const editing = ref<AdminBanner | null>(null)
const formError = ref('')
const imageFile = ref<File | null>(null)

const title = ref('')
const subtitle = ref('')
const linkUrl = ref('')
const placement = ref<BannerPlacement>('HOME_HERO')
const sortOrder = ref<number | ''>(0)
const startsAt = ref('')
const expiresAt = ref('')
const isActive = ref(true)

function toDatetimeLocalValue(iso: string | null) {
  if (!iso) return ''
  const date = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function fromDatetimeLocalValue(value: string) {
  return value ? new Date(value).toISOString() : undefined
}

const columns: UiTableColumn<AdminBanner>[] = [
  { key: 'title', label: 'Banner' },
  { key: 'placement', label: 'Ubicación', width: '9rem' },
  { key: 'sortOrder', label: 'Orden', width: '5rem' },
  { key: 'isActive', label: 'Estado', width: '7rem' },
]

const placementOptions = [
  { label: 'Home principal', value: 'HOME_HERO' },
  { label: 'Home secundario', value: 'HOME_SECONDARY' },
  { label: 'Categoría', value: 'CATEGORY_TOP' },
]

function openCreate() {
  editing.value = null
  title.value = ''
  subtitle.value = ''
  linkUrl.value = ''
  placement.value = 'HOME_HERO'
  sortOrder.value = 0
  startsAt.value = ''
  expiresAt.value = ''
  isActive.value = true
  imageFile.value = null
  formError.value = ''
  modalOpen.value = true
}

function openEdit(banner: AdminBanner) {
  editing.value = banner
  title.value = banner.title
  subtitle.value = banner.subtitle ?? ''
  linkUrl.value = banner.linkUrl ?? ''
  placement.value = banner.placement
  sortOrder.value = banner.sortOrder
  startsAt.value = toDatetimeLocalValue(banner.startsAt)
  expiresAt.value = toDatetimeLocalValue(banner.expiresAt)
  isActive.value = banner.isActive
  imageFile.value = null
  formError.value = ''
  modalOpen.value = true
}

async function onSubmit() {
  formError.value = ''
  try {
    if (editing.value) {
      await updateMutation.mutateAsync({
        id: editing.value.id,
        payload: {
          title: title.value.trim(),
          subtitle: subtitle.value.trim() || undefined,
          linkUrl: linkUrl.value.trim() || undefined,
          placement: placement.value,
          sortOrder: sortOrder.value === '' ? undefined : Number(sortOrder.value),
          startsAt: fromDatetimeLocalValue(startsAt.value),
          expiresAt: fromDatetimeLocalValue(expiresAt.value),
          isActive: isActive.value,
        },
      })
      useToast().success('Banner actualizado')
    } else {
      const created = await createMutation.mutateAsync({
        title: title.value.trim(),
        subtitle: subtitle.value.trim() || undefined,
        linkUrl: linkUrl.value.trim() || undefined,
        placement: placement.value,
        sortOrder: sortOrder.value === '' ? undefined : Number(sortOrder.value),
        startsAt: fromDatetimeLocalValue(startsAt.value),
        expiresAt: fromDatetimeLocalValue(expiresAt.value),
        isActive: isActive.value,
      })
      if (imageFile.value) {
        await uploadMutation.mutateAsync({ bannerId: created.id, file: imageFile.value })
      }
      useToast().success(
        imageFile.value ? 'Banner creado e imagen subida' : 'Banner creado',
      )
    }
    modalOpen.value = false
  } catch (error) {
    formError.value = useApiErrorMessage(error)
  }
}

function removeBanner(banner: AdminBanner) {
  return runAdminSuspendAction({
    confirm: {
      title: 'Eliminar banner',
      message: `¿Eliminar "${banner.title}"?`,
      confirmLabel: 'Eliminar',
    },
    mutate: () => deleteMutation.mutateAsync(banner.id),
    successMessage: 'Banner eliminado',
  })
}

const isSubmitting = computed(
  () =>
    createMutation.isPending.value ||
    updateMutation.isPending.value ||
    uploadMutation.isPending.value,
)
</script>

<template>
  <div>
    <UiFilterBar title="Banners promocionales">
      <UiSearchInput v-model="search" placeholder="Buscar banner…" class="min-w-[16rem] flex-1" />
      <template #actions>
        <UiButton v-if="can('marketing.write')" @click="openCreate">
          <UiIcon name="lucide:plus" :size="16" class="mr-2" />
          Nuevo banner
        </UiButton>
      </template>
    </UiFilterBar>

    <AdminCard no-padding>
      <UiDataTable
        :columns="columns"
        :rows="banners"
        :loading="isPending"
        empty-title="Sin banners"
        empty-description="Crea banners para la home y categorías de la tienda."
      >
        <template #cell-title="{ row }">
          <div class="flex items-center gap-3">
            <div
              v-if="row.imageUrl"
              class="border-admin-line h-10 w-16 overflow-hidden rounded-md border bg-white"
            >
              <img :src="row.imageUrl" :alt="row.title" class="h-full w-full object-cover" />
            </div>
            <div>
              <p class="font-medium">{{ row.title }}</p>
              <p v-if="row.subtitle" class="text-admin-muted text-xs">{{ row.subtitle }}</p>
            </div>
          </div>
        </template>
        <template #cell-placement="{ row }">{{ formatBannerPlacement(row.placement) }}</template>
        <template #cell-isActive="{ row }">
          <UiBadge :variant="row.isActive ? 'success' : 'default'">
            {{ row.isActive ? 'Activo' : 'Inactivo' }}
          </UiBadge>
        </template>
        <template #actions="{ row }">
          <div v-if="can('marketing.write')" class="flex justify-end gap-1">
            <UiIconButton icon="lucide:pencil" ariaLabel="Editar" @click="openEdit(row)" />
            <UiIconButton icon="lucide:trash-2" ariaLabel="Eliminar" @click="removeBanner(row)" />
          </div>
        </template>
      </UiDataTable>
      <div
        v-if="paginationMeta && paginationMeta.total > 0"
        class="border-admin-line border-t px-4 py-3"
      >
        <UiPagination
          :page="paginationMeta.page"
          :page-size="paginationMeta.limit"
          :total="paginationMeta.total"
          tone="admin"
          @update:page="page = $event"
        />
      </div>
    </AdminCard>

    <UiModal
      v-model="modalOpen"
      :title="editing ? 'Editar banner' : 'Nuevo banner'"
      description="Imagen, ubicación y enlace del banner."
      size="lg"
    >
      <form class="space-y-5" @submit.prevent="onSubmit">
        <UiAlert v-if="formError" variant="error">{{ formError }}</UiAlert>

        <AdminFormSection
          title="Contenido"
          description="Título, enlace y ubicación en la tienda."
          icon="lucide:layout-template"
        >
          <div class="grid gap-4 sm:grid-cols-2">
            <UiInput v-model="title" label="Título" required class="sm:col-span-2" />
            <UiInput v-model="subtitle" label="Subtítulo" class="sm:col-span-2" />
            <UiInput v-model="linkUrl" label="Enlace" placeholder="https://…" class="sm:col-span-2" />
            <UiSelect v-model="placement" label="Ubicación" :options="placementOptions" />
            <UiInput v-model.number="sortOrder" label="Orden" type="number" min="0" />
            <UiInput v-model="startsAt" label="Inicio de vigencia" type="datetime-local" />
            <UiInput v-model="expiresAt" label="Fin de vigencia" type="datetime-local" />
            <UiCheckbox v-model="isActive" label="Banner activo" class="sm:col-span-2" />
          </div>
        </AdminFormSection>

        <AdminFormSection
          title="Imagen del banner"
          description="Arrastra o selecciona el archivo promocional."
          icon="lucide:image"
        >
          <AdminBannerAssetUpload
            v-if="editing"
            :banner-id="editing.id"
            :image-url="editing.imageUrl"
            :disabled="isSubmitting"
          />
          <AdminBannerAssetUpload
            v-else
            v-model:pending-file="imageFile"
            :disabled="isSubmitting"
          />
        </AdminFormSection>
      </form>

      <template #footer>
        <AdminModalFooter
          :submit-label="editing ? 'Guardar' : 'Crear banner'"
          :loading="isSubmitting"
          @cancel="modalOpen = false"
          @submit="onSubmit"
        />
      </template>
    </UiModal>
  </div>
</template>
