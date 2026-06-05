<script setup lang="ts">
defineProps<{
  title: string
  module: string
  description?: string
}>()
</script>

<template>
  <AdminCard :title="title" no-padding>
    <div class="px-6 py-12 text-center">
      <div
        class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
        style="background: var(--admin-primary-soft); color: var(--admin-primary)"
      >
        <svg class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" d="M12 6v6l4 2" />
          <circle cx="12" cy="12" r="9" />
        </svg>
      </div>
      <AdminBadge variant="primary" class="inline-block">{{ module }}</AdminBadge>
      <p class="mx-auto mt-4 max-w-md text-sm text-slate-600">
        {{
          description ||
            'Módulo en preparación. Se conectará a los endpoints de /api/admin cuando estén disponibles.'
        }}
      </p>
    </div>
  </AdminCard>
</template>
