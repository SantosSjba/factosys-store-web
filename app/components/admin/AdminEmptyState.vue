<script setup lang="ts">
defineProps<{
  title: string
  module: string
  description?: string
}>()
</script>

<template>
  <AdminCard :title="title" no-padding>
    <UiEmptyState
      :title="title"
      :description="
        description ||
          'Módulo en preparación. Se conectará a los endpoints de /api/admin cuando estén disponibles.'
      "
      icon="lucide:clock-3"
    >
      <template #action>
        <UiBadge variant="primary">{{ module }}</UiBadge>
      </template>
    </UiEmptyState>
  </AdminCard>
</template>
