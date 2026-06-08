<script setup lang="ts">
import type { InventoryReservation } from '~/types/admin-inventory'
import type { UiTableColumn } from '~/types/ui'

const { can } = useAdminPermissions()
const { data: warehouses } = useAdminActiveWarehousesQuery()
const releaseMutation = useAdminReleaseStockReservationMutation()

const filterWarehouseId = ref('')
const filterStatus = ref<'ACTIVE' | 'RELEASED'>('ACTIVE')

const listFilters = computed(() => ({
  warehouseId: filterWarehouseId.value || undefined,
  status: filterStatus.value,
}))

const {
  page,
  search,
  isPending,
  items: reservations,
  paginationMeta,
} = usePaginatedAdminList<InventoryReservation>(
  (params) => useAdminReservationsQuery(params),
  { filters: listFilters, pageSize: 15 },
)

const createOpen = ref(false)

const warehouseFilterOptions = computed(() => [
  { label: 'Todos los almacenes', value: '' },
  ...(warehouses.value ?? []).map((warehouse) => ({
    label: warehouse.name,
    value: warehouse.id,
  })),
])

const statusFilterOptions = [
  { label: 'Activas', value: 'ACTIVE' },
  { label: 'Liberadas', value: 'RELEASED' },
]

const columns: UiTableColumn<InventoryReservation>[] = [
  { key: 'createdAt', label: 'Fecha', width: '9rem' },
  { key: 'sku', label: 'SKU / Producto' },
  { key: 'warehouseName', label: 'Almacén', width: '10rem' },
  { key: 'quantity', label: 'Cantidad', width: '7rem' },
  { key: 'reference', label: 'Referencia', width: '9rem' },
  { key: 'performedByName', label: 'Usuario', width: '9rem' },
]

function releaseReservation(reservation: InventoryReservation) {
  return runAdminSuspendAction({
    confirm: {
      title: 'Liberar reserva',
      message: `¿Liberar ${reservation.quantity} unidades de ${reservation.sku}?`,
      confirmLabel: 'Liberar',
    },
    mutate: () => releaseMutation.mutateAsync(reservation.id),
    successMessage: 'Reserva liberada',
  })
}
</script>

<template>
  <div>
    <UiFilterBar title="Reservas de stock">
      <UiSearchInput
        v-model="search"
        placeholder="Buscar por SKU, referencia…"
        class="min-w-[16rem] flex-1"
      />
      <UiSelect
        v-model="filterWarehouseId"
        :options="warehouseFilterOptions"
        placeholder="Almacén"
        class="min-w-[10rem]"
      />
      <UiSelect
        v-model="filterStatus"
        :options="statusFilterOptions"
        placeholder="Estado"
        class="min-w-[9rem]"
      />
      <template #actions>
        <UiButton v-if="can('inventory.write')" @click="createOpen = true">
          <UiIcon name="lucide:plus" :size="16" class="mr-2" />
          Nueva reserva
        </UiButton>
      </template>
    </UiFilterBar>

    <AdminCard no-padding>
      <UiDataTable
        :columns="columns"
        :rows="reservations"
        :loading="isPending"
        empty-title="Sin reservas"
        empty-description="Las reservas activas aparecerán aquí."
      >
        <template #cell-createdAt="{ row }">{{ formatAdminDate(row.createdAt) }}</template>
        <template #cell-sku="{ row }">
          <p class="font-medium">{{ row.sku }}</p>
          <p class="text-admin-muted truncate text-xs">{{ row.productName }}</p>
        </template>
        <template #cell-reference="{ row }">{{ row.reference || '—' }}</template>
        <template #cell-performedByName="{ row }">{{ row.performedByName || '—' }}</template>
        <template #actions="{ row }">
          <UiIconButton
            v-if="can('inventory.write') && row.status === 'ACTIVE'"
            icon="lucide:unlock"
            ariaLabel="Liberar reserva"
            @click="releaseReservation(row)"
          />
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

    <AdminStockReservationModal v-if="can('inventory.write')" v-model="createOpen" />
  </div>
</template>
