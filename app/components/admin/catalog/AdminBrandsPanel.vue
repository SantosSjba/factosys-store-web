<script setup lang="ts">
import type { CatalogBrand } from '~/types/admin-catalog'
import type { UiTableColumn } from '~/types/ui'

const { can } = useAdminPermissions()
const deleteMutation = useAdminDeleteBrandMutation()

const { page, search, isPending, items: brands, paginationMeta } =
  usePaginatedAdminList<CatalogBrand>((params) => useAdminBrandsQuery(params))

const createOpen = ref(false)
const editOpen = ref(false)
const selectedBrand = ref<CatalogBrand | null>(null)

const columns: UiTableColumn<CatalogBrand>[] = [
  { key: 'name', label: 'Marca' },
  { key: 'website', label: 'Sitio web' },
  { key: 'isActive', label: 'Estado', width: '8rem' },
  { key: 'createdAt', label: 'Alta', width: '9rem' },
]

function removeBrand(brand: CatalogBrand) {
  return runAdminSuspendAction({
    confirm: {
      title: 'Eliminar marca',
      message: `¿Eliminar "${brand.name}"? No debe tener productos asociados.`,
      confirmLabel: 'Eliminar',
    },
    mutate: () => deleteMutation.mutateAsync(brand.id),
    successMessage: 'Marca eliminada',
  })
}
</script>

<template>
  <div>
    <UiFilterBar title="Marcas">
      <UiSearchInput v-model="search" placeholder="Buscar marca…" class="min-w-[16rem] flex-1" />
      <template #actions>
        <UiButton v-if="can('products.write')" @click="createOpen = true">
          <UiIcon name="lucide:plus" :size="16" class="mr-2" />
          Nueva marca
        </UiButton>
      </template>
    </UiFilterBar>

    <AdminCard no-padding>
      <UiDataTable
        :columns="columns"
        :rows="brands"
        :loading="isPending"
        empty-title="Sin marcas"
        empty-description="Registra marcas como Kingston, ASUS, Nike, etc."
      >
        <template #cell-name="{ row }">
          <p class="font-medium">{{ row.name }}</p>
          <p class="text-admin-muted text-xs">{{ row.slug }}</p>
        </template>
        <template #cell-website="{ row }">
          <a
            v-if="row.website"
            :href="row.website"
            target="_blank"
            rel="noopener"
            class="text-brand-accent text-sm hover:underline"
          >{{ row.website }}</a>
          <span v-else>—</span>
        </template>
        <template #cell-isActive="{ row }">
          <UiBadge :variant="row.isActive ? 'success' : 'default'">
            {{ row.isActive ? 'Activa' : 'Inactiva' }}
          </UiBadge>
        </template>
        <template #cell-createdAt="{ row }">{{ formatAdminDate(row.createdAt) }}</template>
        <template #actions="{ row }">
          <div class="flex justify-end gap-1">
            <UiIconButton
              v-if="can('products.write')"
              icon="lucide:pencil"
              ariaLabel="Editar"
              @click="selectedBrand = row; editOpen = true"
            />
            <UiIconButton
              v-if="can('products.write')"
              icon="lucide:trash-2"
              ariaLabel="Eliminar"
              @click="removeBrand(row)"
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

    <AdminBrandCreateModal v-if="can('products.write')" v-model="createOpen" />
    <AdminBrandEditModal v-if="can('products.write')" v-model="editOpen" :brand="selectedBrand" />
  </div>
</template>
