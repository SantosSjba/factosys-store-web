<script setup lang="ts">
definePageMeta({
  layout: 'intranet',
  middleware: 'admin-auth',
  adminTitle: 'Pedidos',
})
</script>

<template>
  <div>
    <AdminPageTitle
      title="Pedidos"
      description="Seguimiento y gestión de órdenes de la tienda."
    />
    <AdminEmptyState title="Listado de pedidos" module="Pedidos" />
  </div>
</template>
