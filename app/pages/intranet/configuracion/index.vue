<script setup lang="ts">
definePageMeta({
  layout: 'intranet',
  middleware: 'admin-auth',
  adminTitle: 'Configuración',
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
