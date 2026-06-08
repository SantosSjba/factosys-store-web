<script setup lang="ts">
import type { UiTabItem } from '~/types/ui'

definePageMeta({
  layout: 'intranet',
  middleware: 'admin-auth',
  adminTitle: 'Inventario',
  adminBreadcrumb: [
    { label: 'Panel', to: '/intranet' },
    { label: 'Gestión' },
    { label: 'Inventario' },
  ],
})

const { can } = useAdminPermissions()
const route = useRoute()
const activeTab = ref(typeof route.query.tab === 'string' ? route.query.tab : 'stock')

const tabs = computed<UiTabItem[]>(() => [
  {
    id: 'stock',
    label: 'Stock',
    icon: 'lucide:boxes',
    disabled: !can('inventory.read'),
  },
  {
    id: 'movements',
    label: 'Movimientos',
    icon: 'lucide:arrow-left-right',
    disabled: !can('inventory.read'),
  },
  {
    id: 'reservations',
    label: 'Reservas',
    icon: 'lucide:bookmark',
    disabled: !can('inventory.read'),
  },
  {
    id: 'warehouses',
    label: 'Almacenes',
    icon: 'lucide:warehouse',
    disabled: !can('inventory.read'),
  },
])

watch(
  tabs,
  (items) => {
    const firstEnabled = items.find((tab) => !tab.disabled)
    if (firstEnabled && items.find((tab) => tab.id === activeTab.value)?.disabled) {
      activeTab.value = firstEnabled.id
    }
  },
  { immediate: true },
)
</script>

<template>
  <div>
    <AdminPageTitle
      title="Inventario"
      description="Stock por almacén, reservas, movimientos y bodegas."
    />

    <UiTabs v-model="activeTab" :tabs="tabs">
      <template #stock>
        <AdminStockPanel v-if="can('inventory.read')" />
        <UiAlert v-else variant="warning">
          No tienes permiso para ver inventario (<code>inventory.read</code>).
        </UiAlert>
      </template>

      <template #movements>
        <AdminMovementsPanel
          v-if="can('inventory.read')"
          :initial-variant-id="typeof route.query.variantId === 'string' ? route.query.variantId : undefined"
        />
        <UiAlert v-else variant="warning">
          No tienes permiso para ver movimientos (<code>inventory.read</code>).
        </UiAlert>
      </template>

      <template #reservations>
        <AdminReservationsPanel v-if="can('inventory.read')" />
        <UiAlert v-else variant="warning">
          No tienes permiso para ver reservas (<code>inventory.read</code>).
        </UiAlert>
      </template>

      <template #warehouses>
        <AdminWarehousesPanel v-if="can('inventory.read')" />
        <UiAlert v-else variant="warning">
          No tienes permiso para ver almacenes (<code>inventory.read</code>).
        </UiAlert>
      </template>
    </UiTabs>
  </div>
</template>
