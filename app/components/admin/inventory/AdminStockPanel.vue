<script setup lang="ts">
import type { InventoryStockLevel } from '~/types/admin-inventory'
import type { UiTableColumn } from '~/types/ui'

const { can } = useAdminPermissions()
const { data: warehouses } = useAdminActiveWarehousesQuery()

const filterWarehouseId = ref('')
const lowStockOnly = ref(false)

const listFilters = computed(() => ({
  warehouseId: filterWarehouseId.value || undefined,
  lowStock: lowStockOnly.value ? 'true' : undefined,
}))

const {
  page,
  search,
  isPending,
  items: stockLevels,
  paginationMeta,
} = usePaginatedAdminList<InventoryStockLevel>(
  (params) => useAdminStockQuery(params),
  { filters: listFilters },
)

const movementOpen = ref(false)
const thresholdOpen = ref(false)
const selectedStockLevel = ref<InventoryStockLevel | null>(null)

function editThreshold(stockLevel: InventoryStockLevel) {
  selectedStockLevel.value = stockLevel
  thresholdOpen.value = true
}

const warehouseFilterOptions = computed(() => [
  { label: 'Todos los almacenes', value: '' },
  ...(warehouses.value ?? []).map((warehouse) => ({
    label: warehouse.name,
    value: warehouse.id,
  })),
])

const columns: UiTableColumn<InventoryStockLevel>[] = [
  { key: 'sku', label: 'SKU / Producto' },
  { key: 'warehouseName', label: 'Almacén', width: '10rem' },
  { key: 'quantityAvailable', label: 'Disponible', width: '8rem' },
  { key: 'quantityOnHand', label: 'En mano', width: '8rem' },
  { key: 'quantityReserved', label: 'Reservado', width: '8rem' },
  { key: 'isLowStock', label: 'Alerta', width: '8rem' },
]
</script>

<template>
  <div>
    <UiFilterBar title="Niveles de stock">
      <UiSearchInput
        v-model="search"
        placeholder="Buscar por SKU o producto…"
        class="min-w-[16rem] flex-1"
      />
      <UiSelect
        v-model="filterWarehouseId"
        :options="warehouseFilterOptions"
        placeholder="Almacén"
        class="min-w-[10rem]"
      />
      <label class="flex items-center gap-2 text-sm">
        <input v-model="lowStockOnly" type="checkbox" class="rounded border-slate-300" />
        Solo stock bajo
      </label>
      <template #actions>
        <UiButton v-if="can('inventory.write')" @click="movementOpen = true">
          <UiIcon name="lucide:plus" :size="16" class="mr-2" />
          Registrar movimiento
        </UiButton>
      </template>
    </UiFilterBar>

    <AdminCard no-padding>
      <UiDataTable
        :columns="columns"
        :rows="stockLevels"
        :loading="isPending"
        empty-title="Sin stock registrado"
        empty-description="Registra una entrada de inventario para comenzar."
      >
        <template #cell-sku="{ row }">
          <p class="font-medium">{{ row.sku }}</p>
          <p class="text-admin-muted truncate text-xs">{{ row.productName }}</p>
        </template>
        <template #cell-quantityAvailable="{ row }">
          <span :class="row.isLowStock ? 'font-semibold text-amber-600' : ''">
            {{ row.quantityAvailable }}
          </span>
        </template>
        <template #cell-isLowStock="{ row }">
          <UiBadge v-if="row.isLowStock" variant="warning">Stock bajo</UiBadge>
          <span v-else class="text-admin-muted">—</span>
          <p v-if="row.lowStockThreshold != null" class="text-admin-muted mt-0.5 text-xs">
            Umbral: {{ row.lowStockThreshold }}
          </p>
        </template>
        <template #actions="{ row }">
          <UiIconButton
            v-if="can('inventory.write')"
            icon="lucide:bell-ring"
            ariaLabel="Configurar umbral de stock bajo"
            @click="editThreshold(row)"
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

    <AdminStockMovementModal v-if="can('inventory.write')" v-model="movementOpen" />
    <AdminStockThresholdModal
      v-if="can('inventory.write')"
      v-model="thresholdOpen"
      :stock-level="selectedStockLevel"
    />
  </div>
</template>
