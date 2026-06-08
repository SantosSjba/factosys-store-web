<script setup lang="ts">
import type { SettingsTaxRate } from '~/types/admin-settings'
import type { UiTableColumn } from '~/types/ui'

const { can } = useAdminPermissions()
const deleteMutation = useAdminDeleteTaxRateMutation()

const {
  page,
  search,
  isPending,
  items: taxRates,
  paginationMeta,
} = usePaginatedAdminList<SettingsTaxRate>((params) => useAdminTaxRatesQuery(params))

const createOpen = ref(false)
const editOpen = ref(false)
const selected = ref<SettingsTaxRate | null>(null)

const columns: UiTableColumn<SettingsTaxRate>[] = [
  { key: 'name', label: 'Impuesto' },
  { key: 'rate', label: 'Tasa', width: '7rem' },
  { key: 'appliesToShipping', label: 'Envío', width: '7rem' },
  { key: 'isDefault', label: 'Predeterminado', width: '10rem' },
  { key: 'isActive', label: 'Estado', width: '8rem' },
]

function removeTaxRate(taxRate: SettingsTaxRate) {
  return runAdminSuspendAction({
    confirm: {
      title: 'Eliminar impuesto',
      message: `¿Eliminar ${taxRate.name}? No debe ser el predeterminado.`,
      confirmLabel: 'Eliminar',
    },
    mutate: () => deleteMutation.mutateAsync(taxRate.id),
    successMessage: 'Impuesto eliminado',
  })
}
</script>

<template>
  <div>
    <UiFilterBar title="Impuestos">
      <UiSearchInput v-model="search" placeholder="Buscar por nombre o código…" class="min-w-[16rem] flex-1" />
      <template #actions>
        <UiButton v-if="can('settings.write')" @click="createOpen = true">
          <UiIcon name="lucide:plus" :size="16" class="mr-2" />
          Nuevo impuesto
        </UiButton>
      </template>
    </UiFilterBar>

    <AdminCard no-padding>
      <UiDataTable :columns="columns" :rows="taxRates" :loading="isPending" empty-title="Sin impuestos">
        <template #cell-name="{ row }">
          <p class="font-medium">{{ row.name }}</p>
          <p v-if="row.code" class="text-admin-muted text-xs">{{ row.code }}</p>
        </template>
        <template #cell-rate="{ row }">{{ row.rate }}%</template>
        <template #cell-appliesToShipping="{ row }">
          {{ row.appliesToShipping ? 'Sí' : 'No' }}
        </template>
        <template #cell-isDefault="{ row }">
          <UiBadge v-if="row.isDefault" variant="info">Principal</UiBadge>
          <span v-else class="text-admin-muted">—</span>
        </template>
        <template #cell-isActive="{ row }">
          <UiBadge :variant="row.isActive ? 'success' : 'default'">
            {{ row.isActive ? 'Activo' : 'Inactivo' }}
          </UiBadge>
        </template>
        <template #actions="{ row }">
          <div v-if="can('settings.write')" class="flex justify-end gap-1">
            <UiIconButton icon="lucide:pencil" ariaLabel="Editar" @click="selected = row; editOpen = true" />
            <UiIconButton icon="lucide:trash-2" ariaLabel="Eliminar" @click="removeTaxRate(row)" />
          </div>
        </template>
      </UiDataTable>
      <div v-if="paginationMeta?.total" class="border-admin-line border-t px-4 py-3">
        <UiPagination :page="paginationMeta.page" :page-size="paginationMeta.limit" :total="paginationMeta.total" tone="admin" @update:page="page = $event" />
      </div>
    </AdminCard>

    <AdminTaxCreateModal v-if="can('settings.write')" v-model="createOpen" />
    <AdminTaxEditModal v-if="can('settings.write')" v-model="editOpen" :tax-rate="selected" />
  </div>
</template>
