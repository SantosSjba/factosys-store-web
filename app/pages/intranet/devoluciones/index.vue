<script setup lang="ts">
definePageMeta({
  layout: 'intranet',
  middleware: 'admin-auth',
  adminTitle: 'Devoluciones',
  adminBreadcrumb: [
    { label: 'Panel', to: '/intranet' },
    { label: 'Gestión' },
    { label: 'Devoluciones' },
  ],
})

const { can } = useAdminPermissions()
</script>

<template>
  <div>
    <AdminPageTitle
      title="Devoluciones (RMA)"
      description="Solicitudes de devolución y reembolso de pedidos entregados."
    />
    <AdminReturnsPanel v-if="can('returns.read')" />
    <UiAlert v-else variant="warning">
      No tienes permiso para ver devoluciones (<code>returns.read</code>).
    </UiAlert>
  </div>
</template>
