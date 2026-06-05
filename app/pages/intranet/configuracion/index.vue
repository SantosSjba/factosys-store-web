<script setup lang="ts">
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
</script>

<template>
  <div>
    <AdminPageTitle
      title="Configuración"
      description="Ajustes generales de la tienda y la intranet."
    />
    <AdminEmptyState title="Ajustes del sistema" module="Configuración" />
  </div>
</template>
