<script setup lang="ts">
import type { UiTabItem } from '~/types/ui'

definePageMeta({
  layout: 'intranet',
  middleware: 'admin-auth',
  adminTitle: 'Configuración',
  adminBreadcrumb: [
    { label: 'Panel', to: '/intranet' },
    { label: 'Sistema' },
    { label: 'Configuración' },
  ],
})

const { can } = useAdminPermissions()
const activeTab = ref('company')

const tabs = computed<UiTabItem[]>(() => [
  { id: 'company', label: 'Empresa', icon: 'lucide:building-2', disabled: !can('settings.read') },
  { id: 'store', label: 'Tienda', icon: 'lucide:store', disabled: !can('settings.read') },
  { id: 'currencies', label: 'Monedas', icon: 'lucide:circle-dollar-sign', disabled: !can('settings.read') },
  { id: 'taxes', label: 'Impuestos', icon: 'lucide:percent', disabled: !can('settings.read') },
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
      title="Configuración"
      description="Empresa, tienda, monedas, impuestos y parámetros operativos."
    />

    <UiTabs v-model="activeTab" :tabs="tabs">
      <template #company>
        <AdminCompanyPanel v-if="can('settings.read')" />
        <UiAlert v-else variant="warning">
          No tienes permiso para ver configuración (<code>settings.read</code>).
        </UiAlert>
      </template>

      <template #store>
        <AdminStoreSettingsPanel v-if="can('settings.read')" />
        <UiAlert v-else variant="warning">
          No tienes permiso para ver configuración (<code>settings.read</code>).
        </UiAlert>
      </template>

      <template #currencies>
        <AdminCurrenciesPanel v-if="can('settings.read')" />
        <UiAlert v-else variant="warning">
          No tienes permiso para ver monedas (<code>settings.read</code>).
        </UiAlert>
      </template>

      <template #taxes>
        <AdminTaxesPanel v-if="can('settings.read')" />
        <UiAlert v-else variant="warning">
          No tienes permiso para ver impuestos (<code>settings.read</code>).
        </UiAlert>
      </template>
    </UiTabs>
  </div>
</template>
