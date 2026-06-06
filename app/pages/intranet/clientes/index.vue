<script setup lang="ts">
definePageMeta({
  layout: 'intranet',
  middleware: 'admin-auth',
  adminTitle: 'Clientes',
  adminBreadcrumb: [
    { label: 'Panel', to: '/intranet' },
    { label: 'Gestión' },
    { label: 'Clientes' },
  ],
})

const { can } = useAdminPermissions()
</script>

<template>
  <div>
    <AdminPageTitle
      title="Clientes"
      description="Clientes registrados en la tienda online."
    />

    <AdminCustomersPanel v-if="can('users.read')" />
    <UiAlert v-else variant="warning">
      No tienes permiso para ver clientes (<code>users.read</code>).
    </UiAlert>
  </div>
</template>
