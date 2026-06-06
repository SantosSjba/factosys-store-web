<script setup lang="ts">
import type { UiTabItem } from '~/types/ui'

definePageMeta({
  layout: 'intranet',
  middleware: 'admin-auth',
  adminTitle: 'Usuarios',
  adminBreadcrumb: [
    { label: 'Panel', to: '/intranet' },
    { label: 'Sistema' },
    { label: 'Usuarios' },
  ],
})

const { can } = useAdminPermissions()

const activeTab = ref('users')

const tabs = computed<UiTabItem[]>(() => [
  {
    id: 'users',
    label: 'Personal',
    icon: 'lucide:users',
    disabled: !can('users.read'),
  },
  {
    id: 'roles',
    label: 'Roles y permisos',
    icon: 'lucide:shield',
    disabled: !can('roles.read'),
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
      title="Usuarios"
      description="Gestión del personal staff, roles y permisos del sistema."
    />

    <UiTabs v-model="activeTab" :tabs="tabs">
      <template #users>
        <AdminUsersPanel v-if="can('users.read')" />
        <UiAlert v-else variant="warning">
          No tienes permiso para ver usuarios del sistema (<code>users.read</code>).
        </UiAlert>
      </template>

      <template #roles>
        <AdminRolesPanel v-if="can('roles.read')" />
        <UiAlert v-else variant="warning">
          No tienes permiso para ver roles (<code>roles.read</code>).
        </UiAlert>
      </template>
    </UiTabs>
  </div>
</template>
