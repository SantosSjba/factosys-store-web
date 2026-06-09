<script setup lang="ts">
import type { AdminAuditEntry } from '~/types/admin-audit'
import type { UiTableColumn } from '~/types/ui'
import { formatModuleLabel } from '~/constants/admin-permissions'
import {
  auditActionVariant,
  formatAuditAction,
  formatAuditModule,
} from '~/utils/format-audit'

const page = ref(1)
const search = ref('')
const filterModule = ref('')

const queryParams = computed(() => ({
  page: page.value,
  limit: 20,
  search: search.value.trim() || undefined,
  module: filterModule.value || undefined,
}))

const { data, isPending } = useAdminAuditQuery(queryParams)

const entries = computed(() => data.value?.items ?? [])
const paginationMeta = computed(() => data.value?.meta)

const moduleOptions = computed(() => {
  const modules = new Set(entries.value.map((entry) => entry.module))
  return [
    { label: 'Todos los módulos', value: '' },
    ...[...modules].sort().map((module) => ({
      label: formatModuleLabel(module),
      value: module,
    })),
  ]
})

watch([search, filterModule], () => {
  page.value = 1
})

const columns: UiTableColumn<AdminAuditEntry>[] = [
  { key: 'createdAt', label: 'Fecha', width: '10rem' },
  { key: 'action', label: 'Acción', width: '9rem' },
  { key: 'module', label: 'Módulo', width: '8rem' },
  { key: 'description', label: 'Descripción' },
  { key: 'user', label: 'Usuario', width: '10rem' },
]
</script>

<template>
  <div>
    <UiFilterBar title="Actividad administrativa">
      <UiSearchInput
        v-model="search"
        placeholder="Buscar por descripción, entidad…"
        class="min-w-[16rem] flex-1"
      />
      <UiSelect
        v-model="filterModule"
        :options="moduleOptions"
        placeholder="Módulo"
        class="min-w-[10rem]"
      />
    </UiFilterBar>

    <AdminCard no-padding>
      <UiDataTable
        :columns="columns"
        :rows="entries"
        :loading="isPending"
        empty-title="Sin actividad"
        empty-description="No hay registros de auditoría con los filtros actuales."
      >
        <template #cell-createdAt="{ row }">
          {{ formatAdminDateTime(row.createdAt) }}
        </template>
        <template #cell-action="{ row }">
          <UiBadge :variant="auditActionVariant(row.action)">
            {{ formatAuditAction(row.action) }}
          </UiBadge>
        </template>
        <template #cell-module="{ row }">
          {{ formatAuditModule(row.module) }}
        </template>
        <template #cell-description="{ row }">
          <p class="text-sm">{{ row.description }}</p>
          <p v-if="row.entityType" class="text-admin-muted text-xs">
            {{ row.entityType }}{{ row.entityId ? ` · ${row.entityId}` : '' }}
          </p>
        </template>
        <template #cell-user="{ row }">
          <div v-if="row.user">
            <p class="text-sm font-medium">{{ row.user.name || row.user.email }}</p>
            <p v-if="row.user.name" class="text-admin-muted text-xs">{{ row.user.email }}</p>
          </div>
          <span v-else class="text-admin-muted">Sistema</span>
        </template>
      </UiDataTable>
      <div
        v-if="paginationMeta && paginationMeta.total > 0"
        class="border-admin-line border-t px-4 py-3"
      >
        <UiPagination
          :page="paginationMeta.page"
          :page-size="paginationMeta.limit"
          :total="paginationMeta.total"
          tone="admin"
          @update:page="page = $event"
        />
      </div>
    </AdminCard>
  </div>
</template>
