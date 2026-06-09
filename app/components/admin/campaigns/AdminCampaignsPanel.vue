<script setup lang="ts">
import type { AdminCampaign } from '~/types/admin-campaigns'
import type { UiTableColumn } from '~/types/ui'

const { can } = useAdminPermissions()
const createMutation = useAdminCreateCampaignMutation()
const updateMutation = useAdminUpdateCampaignMutation()
const deleteMutation = useAdminDeleteCampaignMutation()

const { page, search, isPending, items: campaigns, paginationMeta } =
  usePaginatedAdminList<AdminCampaign>((params) => useAdminCampaignsQuery(params))

const { data: couponsData } = useAdminCouponsQuery(computed(() => ({ page: 1, limit: 100 })))
const { data: bannersData } = useAdminBannersQuery(computed(() => ({ page: 1, limit: 100 })))

const modalOpen = ref(false)
const editing = ref<AdminCampaign | null>(null)
const formError = ref('')

const name = ref('')
const slug = ref('')
const description = ref('')
const couponId = ref('')
const selectedBannerIds = ref<string[]>([])
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

const columns: UiTableColumn<AdminCampaign>[] = [
  { key: 'name', label: 'Campaña' },
  { key: 'couponCode', label: 'Cupón', width: '8rem' },
  { key: 'banners', label: 'Banners', width: '6rem' },
  { key: 'isActive', label: 'Estado', width: '7rem' },
]

const couponOptions = computed(() =>
  (couponsData.value?.items ?? []).map((coupon) => ({
    label: coupon.code,
    value: coupon.id,
  })),
)

const bannerOptions = computed(() => bannersData.value?.items ?? [])

function openCreate() {
  editing.value = null
  name.value = ''
  slug.value = ''
  description.value = ''
  couponId.value = ''
  selectedBannerIds.value = []
  startsAt.value = ''
  expiresAt.value = ''
  isActive.value = true
  formError.value = ''
  modalOpen.value = true
}

function openEdit(campaign: AdminCampaign) {
  editing.value = campaign
  name.value = campaign.name
  slug.value = campaign.slug
  description.value = campaign.description ?? ''
  couponId.value = campaign.couponId ?? ''
  selectedBannerIds.value = [...campaign.bannerIds]
  startsAt.value = toDatetimeLocalValue(campaign.startsAt)
  expiresAt.value = toDatetimeLocalValue(campaign.expiresAt)
  isActive.value = campaign.isActive
  formError.value = ''
  modalOpen.value = true
}

function toggleBanner(id: string) {
  if (selectedBannerIds.value.includes(id)) {
    selectedBannerIds.value = selectedBannerIds.value.filter((value) => value !== id)
  } else {
    selectedBannerIds.value = [...selectedBannerIds.value, id]
  }
}

async function onSubmit() {
  formError.value = ''
  const payload = {
    name: name.value.trim(),
    slug: slug.value.trim() || undefined,
    description: description.value.trim() || undefined,
    couponId: couponId.value || undefined,
    bannerIds: selectedBannerIds.value,
    startsAt: fromDatetimeLocalValue(startsAt.value),
    expiresAt: fromDatetimeLocalValue(expiresAt.value),
    isActive: isActive.value,
  }

  try {
    if (editing.value) {
      await updateMutation.mutateAsync({ id: editing.value.id, payload })
      useToast().success('Campaña actualizada')
    } else {
      await createMutation.mutateAsync(payload)
      useToast().success('Campaña creada')
    }
    modalOpen.value = false
  } catch (error) {
    formError.value = useApiErrorMessage(error)
  }
}

function removeCampaign(campaign: AdminCampaign) {
  return runAdminSuspendAction({
    confirm: {
      title: 'Eliminar campaña',
      message: `¿Eliminar "${campaign.name}"?`,
      confirmLabel: 'Eliminar',
    },
    mutate: () => deleteMutation.mutateAsync(campaign.id),
    successMessage: 'Campaña eliminada',
  })
}

const isSubmitting = computed(
  () => createMutation.isPending.value || updateMutation.isPending.value,
)
</script>

<template>
  <div>
    <UiFilterBar title="Campañas de marketing">
      <UiSearchInput v-model="search" placeholder="Buscar campaña…" class="min-w-[16rem] flex-1" />
      <template #actions>
        <UiButton v-if="can('marketing.write')" @click="openCreate">
          <UiIcon name="lucide:plus" :size="16" class="mr-2" />
          Nueva campaña
        </UiButton>
      </template>
    </UiFilterBar>

    <AdminCard no-padding>
      <UiDataTable
        :columns="columns"
        :rows="campaigns"
        :loading="isPending"
        empty-title="Sin campañas"
        empty-description="Agrupa banners y cupones en campañas con vigencia."
      >
        <template #cell-name="{ row }">
          <p class="font-medium">{{ row.name }}</p>
          <p class="text-admin-muted text-xs">{{ row.slug }}</p>
        </template>
        <template #cell-couponCode="{ row }">
          <span v-if="row.couponCode" class="font-mono text-sm">{{ row.couponCode }}</span>
          <span v-else>—</span>
        </template>
        <template #cell-banners="{ row }">{{ row.banners.length }}</template>
        <template #cell-isActive="{ row }">
          <UiBadge :variant="row.isActive ? 'success' : 'default'">
            {{ row.isActive ? 'Activa' : 'Inactiva' }}
          </UiBadge>
        </template>
        <template #actions="{ row }">
          <div v-if="can('marketing.write')" class="flex justify-end gap-1">
            <UiIconButton icon="lucide:pencil" ariaLabel="Editar" @click="openEdit(row)" />
            <UiIconButton icon="lucide:trash-2" ariaLabel="Eliminar" @click="removeCampaign(row)" />
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
      :title="editing ? 'Editar campaña' : 'Nueva campaña'"
      description="Nombre, cupón asociado y banners de la campaña."
      size="lg"
    >
      <form class="space-y-4" @submit.prevent="onSubmit">
        <UiAlert v-if="formError" variant="error">{{ formError }}</UiAlert>
        <UiInput v-model="name" label="Nombre" required />
        <UiInput v-model="slug" label="Slug" hint="Opcional, se genera del nombre" />
        <UiInput v-model="description" label="Descripción" />
        <UiSelect
          v-model="couponId"
          label="Cupón asociado"
          :options="[{ label: 'Sin cupón', value: '' }, ...couponOptions]"
        />
        <div>
          <p class="text-admin mb-2 text-sm font-medium">Banners incluidos</p>
          <div v-if="!bannerOptions.length" class="text-admin-muted text-sm">
            Crea banners primero para asociarlos.
          </div>
          <div v-else class="max-h-40 space-y-2 overflow-y-auto rounded-lg border p-3">
            <UiCheckbox
              v-for="banner in bannerOptions"
              :key="banner.id"
              :model-value="selectedBannerIds.includes(banner.id)"
              :label="banner.title"
              @update:model-value="
                (checked) => {
                  if (checked && !selectedBannerIds.includes(banner.id)) toggleBanner(banner.id)
                  if (!checked && selectedBannerIds.includes(banner.id)) toggleBanner(banner.id)
                }
              "
            />
          </div>
        </div>
        <div class="grid gap-4 sm:grid-cols-2">
          <UiInput v-model="startsAt" label="Inicio de vigencia" type="datetime-local" />
          <UiInput v-model="expiresAt" label="Fin de vigencia" type="datetime-local" />
        </div>
        <UiCheckbox v-model="isActive" label="Campaña activa" />
      </form>
      <template #footer>
        <UiButton variant="ghost" @click="modalOpen = false">Cancelar</UiButton>
        <UiButton :loading="isSubmitting" @click="onSubmit">
          {{ editing ? 'Guardar' : 'Crear' }}
        </UiButton>
      </template>
    </UiModal>
  </div>
</template>
