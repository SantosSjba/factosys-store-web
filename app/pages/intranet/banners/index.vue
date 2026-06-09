<script setup lang="ts">
definePageMeta({
  layout: 'intranet',
  middleware: 'admin-auth',
  adminTitle: 'Banners',
  adminBreadcrumb: [
    { label: 'Panel', to: '/intranet' },
    { label: 'Marketing' },
    { label: 'Banners' },
  ],
})

const { can } = useAdminPermissions()
</script>

<template>
  <div>
    <AdminPageTitle
      title="Banners"
      description="Imágenes promocionales para la tienda pública."
    />
    <AdminBannersPanel v-if="can('marketing.read')" />
    <UiAlert v-else variant="warning">
      No tienes permiso para ver marketing (<code>marketing.read</code>).
    </UiAlert>
  </div>
</template>
