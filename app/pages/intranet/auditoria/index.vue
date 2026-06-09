<script setup lang="ts">
definePageMeta({
  layout: 'intranet',
  middleware: 'admin-auth',
  adminTitle: 'Auditoría',
  adminBreadcrumb: [
    { label: 'Panel', to: '/intranet' },
    { label: 'Sistema' },
    { label: 'Auditoría' },
  ],
})

const { can } = useAdminPermissions()
</script>

<template>
  <div>
    <AdminPageTitle
      title="Auditoría"
      description="Registro de acciones administrativas en el sistema."
    />
    <AdminAuditPanel v-if="can('audit.read')" />
    <UiAlert v-else variant="warning">
      No tienes permiso para ver auditoría (<code>audit.read</code>).
    </UiAlert>
  </div>
</template>
