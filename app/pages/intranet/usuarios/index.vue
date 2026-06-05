<script setup lang="ts">
definePageMeta({
  layout: 'intranet',
  middleware: 'admin-auth',
  adminTitle: 'Usuarios',
})
</script>

<template>
  <div>
    <AdminPageTitle
      title="Usuarios"
      description="Personal, roles y permisos del staff."
    />
    <AdminEmptyState title="Usuarios y roles" module="Usuarios" />
  </div>
</template>
