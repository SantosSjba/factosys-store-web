<script setup lang="ts">
import type { CatalogAttribute } from '~/types/admin-catalog'
import type { UiTableColumn } from '~/types/ui'

const { can } = useAdminPermissions()
const deleteMutation = useAdminDeleteAttributeMutation()

const { page, search, isPending, items: attributes, paginationMeta } =
  usePaginatedAdminList<CatalogAttribute>((params) => useAdminAttributesQuery(params))

const createOpen = ref(false)
const editOpen = ref(false)
const selectedAttribute = ref<CatalogAttribute | null>(null)

const columns: UiTableColumn<CatalogAttribute>[] = [
  { key: 'name', label: 'Atributo' },
  { key: 'scope', label: 'Ámbito', width: '8rem' },
  { key: 'dataType', label: 'Tipo', width: '9rem' },
  { key: 'isFilterable', label: 'Filtro', width: '6rem' },
]

function removeAttribute(attr: CatalogAttribute) {
  return runAdminSuspendAction({
    confirm: {
      title: 'Eliminar atributo',
      message: `¿Eliminar "${attr.name}"?`,
      confirmLabel: 'Eliminar',
    },
    mutate: () => deleteMutation.mutateAsync(attr.id),
    successMessage: 'Atributo eliminado',
  })
}
</script>

<template>
  <div>
    <UiFilterBar title="Atributos">
      <UiSearchInput v-model="search" placeholder="Buscar atributo…" class="min-w-[16rem] flex-1" />
      <template #actions>
        <UiButton v-if="can('products.write')" @click="createOpen = true">
          <UiIcon name="lucide:plus" :size="16" class="mr-2" />
          Nuevo atributo
        </UiButton>
      </template>
    </UiFilterBar>

    <AdminCard no-padding>
      <UiDataTable
        :columns="columns"
        :rows="attributes"
        :loading="isPending"
        empty-title="Sin atributos"
        empty-description="Define RAM, color, talla y más."
      >
        <template #cell-name="{ row }">
          <p class="font-medium">{{ row.name }}</p>
          <p class="text-admin-muted text-xs">
            {{ row.slug }}{{ row.unit ? ` · ${row.unit}` : '' }}
          </p>
        </template>
        <template #cell-scope="{ row }">{{ formatAttributeScope(row.scope) }}</template>
        <template #cell-dataType="{ row }">{{ formatAttributeDataType(row.dataType) }}</template>
        <template #cell-isFilterable="{ row }">
          <UiBadge :variant="row.isFilterable ? 'info' : 'default'">
            {{ row.isFilterable ? 'Sí' : 'No' }}
          </UiBadge>
        </template>
        <template #actions="{ row }">
          <div class="flex justify-end gap-1">
            <UiIconButton
              v-if="can('products.write')"
              icon="lucide:pencil"
              ariaLabel="Editar"
              @click="selectedAttribute = row; editOpen = true"
            />
            <UiIconButton
              v-if="can('products.write')"
              icon="lucide:trash-2"
              ariaLabel="Eliminar"
              @click="removeAttribute(row)"
            />
          </div>
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

    <AdminAttributeCreateModal v-if="can('products.write')" v-model="createOpen" />
    <AdminAttributeEditModal v-if="can('products.write')" v-model="editOpen" :attribute="selectedAttribute" />
  </div>
</template>
