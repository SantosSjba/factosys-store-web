<script setup lang="ts">
definePageMeta({
  layout: 'intranet',
  middleware: 'admin-auth',
  adminTitle: 'Catálogo',
})
</script>

<template>
  <div>
    <AdminPageTitle
      title="Catálogo"
      description="Gestión de productos, categorías y stock."
    />
    <AdminEmptyState title="Catálogo de productos" module="Catálogo" />
  </div>
</template>
