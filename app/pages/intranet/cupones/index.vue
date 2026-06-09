<script setup lang="ts">
definePageMeta({
  layout: 'intranet',
  middleware: 'admin-auth',
  adminTitle: 'Cupones',
  adminBreadcrumb: [
    { label: 'Panel', to: '/intranet' },
    { label: 'Gestión' },
    { label: 'Cupones' },
  ],
})

const { can } = useAdminPermissions()
</script>

<template>
  <div>
    <AdminPageTitle
      title="Cupones"
      description="Gestiona promociones, límites de uso y vigencia de códigos de descuento."
    />

    <AdminCouponsPanel v-if="can('coupons.read')" />
    <UiAlert v-else variant="warning">
      No tienes permiso para ver cupones (<code>coupons.read</code>).
    </UiAlert>
  </div>
</template>
