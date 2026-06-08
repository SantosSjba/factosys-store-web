<script setup lang="ts">
import type { InventoryWarehouse } from '~/types/admin-inventory'
import type { UiTableColumn } from '~/types/ui'

const { can } = useAdminPermissions()
const deleteMutation = useAdminDeleteWarehouseMutation()

const {
  page,
  search,
  isPending,
  items: warehouses,
  paginationMeta,
} = usePaginatedAdminList<InventoryWarehouse>((params) => useAdminWarehousesQuery(params))

const createOpen = ref(false)
const editOpen = ref(false)
const selectedWarehouse = ref<InventoryWarehouse | null>(null)

const columns: UiTableColumn<InventoryWarehouse>[] = [
  { key: 'name', label: 'Almacén' },
  { key: 'address', label: 'Ubicación' },
  { key: 'isDefault', label: 'Predeterminado', width: '10rem' },
  { key: 'isActive', label: 'Estado', width: '8rem' },
]

function removeWarehouse(warehouse: InventoryWarehouse) {
  return runAdminSuspendAction({
    confirm: {
      title: 'Eliminar almacén',
      message: `¿Eliminar "${warehouse.name}"? Debe estar vacío y no ser el predeterminado.`,
      confirmLabel: 'Eliminar',
    },
    mutate: () => deleteMutation.mutateAsync(warehouse.id),
    successMessage: 'Almacén eliminado',
  })
}
</script>

<template>
  <div>
    <UiFilterBar title="Almacenes">
      <UiSearchInput
        v-model="search"
        placeholder="Buscar por nombre o código…"
        class="min-w-[16rem] flex-1"
      />
      <template #actions>
        <UiButton v-if="can('inventory.write')" @click="createOpen = true">
          <UiIcon name="lucide:plus" :size="16" class="mr-2" />
          Nuevo almacén
        </UiButton>
      </template>
    </UiFilterBar>

    <AdminCard no-padding>
      <UiDataTable
        :columns="columns"
        :rows="warehouses"
        :loading="isPending"
        empty-title="Sin almacenes"
        empty-description="Crea el almacén principal para empezar a registrar stock."
      >
        <template #cell-name="{ row }">
          <p class="font-medium">{{ row.name }}</p>
          <p class="text-admin-muted text-xs">{{ row.code }}</p>
        </template>
        <template #cell-address="{ row }">{{ row.address || '—' }}</template>
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
          <div class="flex justify-end gap-1">
            <UiIconButton
              v-if="can('inventory.write')"
              icon="lucide:pencil"
              ariaLabel="Editar almacén"
              @click="selectedWarehouse = row; editOpen = true"
            />
            <UiIconButton
              v-if="can('inventory.write')"
              icon="lucide:trash-2"
              ariaLabel="Eliminar almacén"
              @click="removeWarehouse(row)"
            />
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

    <AdminWarehouseCreateModal v-if="can('inventory.write')" v-model="createOpen" />
    <AdminWarehouseEditModal
      v-if="can('inventory.write')"
      v-model="editOpen"
      :warehouse="selectedWarehouse"
    />
  </div>
</template>
