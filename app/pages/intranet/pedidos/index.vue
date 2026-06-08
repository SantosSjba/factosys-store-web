<script setup lang="ts">
definePageMeta({
  layout: 'intranet',
  middleware: 'admin-auth',
  adminTitle: 'Pedidos',
  adminBreadcrumb: [
    { label: 'Panel', to: '/intranet' },
    { label: 'Gestión' },
    { label: 'Pedidos' },
  ],
})

const { can } = useAdminPermissions()
</script>

<template>
  <div>
    <AdminPageTitle
      title="Pedidos"
      description="Seguimiento, creación manual y gestión de órdenes de la tienda."
    />

    <AdminOrdersPanel v-if="can('orders.read')" />
    <UiAlert v-else variant="warning">
      No tienes permiso para ver pedidos (<code>orders.read</code>).
    </UiAlert>
  </div>
</template>
