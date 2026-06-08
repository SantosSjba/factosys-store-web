<script setup lang="ts">
import type { SettingsCurrency } from '~/types/admin-settings'
import type { UiTableColumn } from '~/types/ui'

const { can } = useAdminPermissions()
const deleteMutation = useAdminDeleteCurrencyMutation()

const {
  page,
  search,
  isPending,
  items: currencies,
  paginationMeta,
} = usePaginatedAdminList<SettingsCurrency>((params) => useAdminCurrenciesQuery(params))

const createOpen = ref(false)
const editOpen = ref(false)
const selected = ref<SettingsCurrency | null>(null)

const columns: UiTableColumn<SettingsCurrency>[] = [
  { key: 'code', label: 'Moneda' },
  { key: 'exchangeRate', label: 'Tipo cambio', width: '9rem' },
  { key: 'isDefault', label: 'Predeterminada', width: '10rem' },
  { key: 'isActive', label: 'Estado', width: '8rem' },
]

function removeCurrency(currency: SettingsCurrency) {
  return runAdminSuspendAction({
    confirm: {
      title: 'Eliminar moneda',
      message: `¿Eliminar ${currency.code}? No debe ser la predeterminada.`,
      confirmLabel: 'Eliminar',
    },
    mutate: () => deleteMutation.mutateAsync(currency.id),
    successMessage: 'Moneda eliminada',
  })
}
</script>

<template>
  <div>
    <UiFilterBar title="Monedas">
      <UiSearchInput v-model="search" placeholder="Buscar por código o nombre…" class="min-w-[16rem] flex-1" />
      <template #actions>
        <UiButton v-if="can('settings.write')" @click="createOpen = true">
          <UiIcon name="lucide:plus" :size="16" class="mr-2" />
          Nueva moneda
        </UiButton>
      </template>
    </UiFilterBar>

    <AdminCard no-padding>
      <UiDataTable :columns="columns" :rows="currencies" :loading="isPending" empty-title="Sin monedas">
        <template #cell-code="{ row }">
          <p class="font-medium">{{ row.code }}</p>
          <p class="text-admin-muted text-xs">{{ row.name }} ({{ row.symbol }})</p>
        </template>
        <template #cell-exchangeRate="{ row }">{{ row.exchangeRate }}</template>
        <template #cell-isDefault="{ row }">
          <UiBadge v-if="row.isDefault" variant="info">Principal</UiBadge>
          <span v-else class="text-admin-muted">—</span>
        </template>
        <template #cell-isActive="{ row }">
          <UiBadge :variant="row.isActive ? 'success' : 'default'">
            {{ row.isActive ? 'Activa' : 'Inactiva' }}
          </UiBadge>
        </template>
        <template #actions="{ row }">
          <div v-if="can('settings.write')" class="flex justify-end gap-1">
            <UiIconButton icon="lucide:pencil" ariaLabel="Editar" @click="selected = row; editOpen = true" />
            <UiIconButton icon="lucide:trash-2" ariaLabel="Eliminar" @click="removeCurrency(row)" />
          </div>
        </template>
      </UiDataTable>
      <div v-if="paginationMeta?.total" class="border-admin-line border-t px-4 py-3">
        <UiPagination :page="paginationMeta.page" :page-size="paginationMeta.limit" :total="paginationMeta.total" tone="admin" @update:page="page = $event" />
      </div>
    </AdminCard>

    <AdminCurrencyCreateModal v-if="can('settings.write')" v-model="createOpen" />
    <AdminCurrencyEditModal v-if="can('settings.write')" v-model="editOpen" :currency="selected" />
  </div>
</template>
