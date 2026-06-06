<script setup lang="ts">
import type { UiTabItem } from '~/types/ui'

definePageMeta({
  layout: 'intranet',
  middleware: 'admin-auth',
  adminTitle: 'Catálogo',
  adminBreadcrumb: [
    { label: 'Panel', to: '/intranet' },
    { label: 'Gestión' },
    { label: 'Catálogo' },
  ],
})

const { can } = useAdminPermissions()

const activeTab = ref('products')

const tabs = computed<UiTabItem[]>(() => [
  {
    id: 'products',
    label: 'Productos',
    icon: 'lucide:package',
    disabled: !can('products.read'),
  },
  {
    id: 'categories',
    label: 'Categorías',
    icon: 'lucide:folder-tree',
    disabled: !can('products.read'),
  },
  {
    id: 'brands',
    label: 'Marcas',
    icon: 'lucide:tag',
    disabled: !can('products.read'),
  },
  {
    id: 'attributes',
    label: 'Atributos',
    icon: 'lucide:list-tree',
    disabled: !can('products.read'),
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
      title="Catálogo"
      description="Gestión de productos, categorías, marcas y atributos."
    />

    <UiTabs v-model="activeTab" :tabs="tabs">
      <template #products>
        <AdminProductsPanel v-if="can('products.read')" />
        <UiAlert v-else variant="warning">
          No tienes permiso para ver productos (<code>products.read</code>).
        </UiAlert>
      </template>

      <template #categories>
        <AdminCategoriesPanel v-if="can('products.read')" />
        <UiAlert v-else variant="warning">
          No tienes permiso para ver categorías (<code>products.read</code>).
        </UiAlert>
      </template>

      <template #brands>
        <AdminBrandsPanel v-if="can('products.read')" />
        <UiAlert v-else variant="warning">
          No tienes permiso para ver marcas (<code>products.read</code>).
        </UiAlert>
      </template>

      <template #attributes>
        <AdminAttributesPanel v-if="can('products.read')" />
        <UiAlert v-else variant="warning">
          No tienes permiso para ver atributos (<code>products.read</code>).
        </UiAlert>
      </template>
    </UiTabs>
  </div>
</template>
