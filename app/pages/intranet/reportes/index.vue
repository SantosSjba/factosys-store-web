<script setup lang="ts">
definePageMeta({
  layout: 'intranet',
  middleware: 'admin-auth',
  adminTitle: 'Reportes',
  adminBreadcrumb: [
    { label: 'Panel', to: '/intranet' },
    { label: 'Reportes' },
  ],
})

const { can } = useAdminPermissions()
</script>

<template>
  <div>
    <AdminPageTitle
      title="Reportes"
      description="Ventas por periodo, top productos y exportación CSV."
    />
    <AdminSalesReportsPanel v-if="can('reports.read')" />
    <UiAlert v-else variant="warning">
      No tienes permiso para ver reportes (<code>reports.read</code>).
    </UiAlert>
  </div>
</template>
