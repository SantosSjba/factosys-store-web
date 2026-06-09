<script setup lang="ts">
definePageMeta({
  layout: 'intranet',
  middleware: 'admin-auth',
  adminTitle: 'Campañas',
  adminBreadcrumb: [
    { label: 'Panel', to: '/intranet' },
    { label: 'Marketing' },
    { label: 'Campañas' },
  ],
})

const { can } = useAdminPermissions()
</script>

<template>
  <div>
    <AdminPageTitle
      title="Campañas"
      description="Agrupa banners y cupones en promociones con vigencia."
    />
    <AdminCampaignsPanel v-if="can('marketing.read')" />
    <UiAlert v-else variant="warning">
      No tienes permiso para ver marketing (<code>marketing.read</code>).
    </UiAlert>
  </div>
</template>
