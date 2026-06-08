<script setup lang="ts">
import type { InventoryMovement } from '~/types/admin-inventory'
import type { UiTableColumn } from '~/types/ui'
import {
  formatStockMovementType,
  stockMovementVariant,
} from '~/utils/inventory/format-stock-movement'

const { data: warehouses } = useAdminActiveWarehousesQuery()
const filterWarehouseId = ref('')

const listFilters = computed(() => ({
  warehouseId: filterWarehouseId.value || undefined,
}))

const {
  page,
  isPending,
  items: movements,
  paginationMeta,
} = usePaginatedAdminList<InventoryMovement>(
  (params) => useAdminMovementsQuery(params),
  { filters: listFilters, pageSize: 15 },
)

const warehouseFilterOptions = computed(() => [
  { label: 'Todos los almacenes', value: '' },
  ...(warehouses.value ?? []).map((warehouse) => ({
    label: warehouse.name,
    value: warehouse.id,
  })),
])

const columns: UiTableColumn<InventoryMovement>[] = [
  { key: 'createdAt', label: 'Fecha', width: '9rem' },
  { key: 'type', label: 'Tipo', width: '9rem' },
  { key: 'sku', label: 'SKU / Producto' },
  { key: 'warehouseName', label: 'Almacén', width: '10rem' },
  { key: 'quantityChange', label: 'Cambio', width: '7rem' },
  { key: 'quantityAfter', label: 'Resultado', width: '8rem' },
]
</script>

<template>
  <div>
    <UiFilterBar title="Historial de movimientos">
      <UiSelect
        v-model="filterWarehouseId"
        :options="warehouseFilterOptions"
        placeholder="Almacén"
        class="min-w-[12rem]"
      />
    </UiFilterBar>

    <AdminCard no-padding>
      <UiDataTable
        :columns="columns"
        :rows="movements"
        :loading="isPending"
        empty-title="Sin movimientos"
        empty-description="Los movimientos aparecerán aquí al registrar entradas o salidas."
      >
        <template #cell-createdAt="{ row }">{{ formatAdminDate(row.createdAt) }}</template>
        <template #cell-type="{ row }">
          <UiBadge :variant="stockMovementVariant(row.type)">
            {{ formatStockMovementType(row.type) }}
          </UiBadge>
        </template>
        <template #cell-sku="{ row }">
          <p class="font-medium">{{ row.sku }}</p>
          <p class="text-admin-muted truncate text-xs">{{ row.productName }}</p>
          <p v-if="row.targetWarehouseName" class="text-admin-muted text-xs">
            → {{ row.targetWarehouseName }}
          </p>
        </template>
        <template #cell-quantityChange="{ row }">
          <span :class="row.quantityChange >= 0 ? 'text-emerald-600' : 'text-red-600'">
            {{ row.quantityChange >= 0 ? '+' : '' }}{{ row.quantityChange }}
          </span>
        </template>
        <template #cell-quantityAfter="{ row }">{{ row.quantityAfter }}</template>
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
  </div>
</template>
