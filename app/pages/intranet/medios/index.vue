<script setup lang="ts">
definePageMeta({
  layout: 'intranet',
  middleware: 'admin-auth',
  adminTitle: 'Medios',
  adminBreadcrumb: [
    { label: 'Panel', to: '/intranet' },
    { label: 'Sistema' },
    { label: 'Medios' },
  ],
})

const { can } = useAdminPermissions()
</script>

<template>
  <div>
    <AdminPageTitle
      title="Biblioteca de medios"
      description="Archivos subidos para banners, productos y contenido."
    />
    <AdminMediaPanel v-if="can('media.read')" />
    <UiAlert v-else variant="warning">
      No tienes permiso para ver medios (<code>media.read</code>).
    </UiAlert>
  </div>
</template>
