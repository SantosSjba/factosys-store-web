<script setup lang="ts">
import type { CatalogProduct, ProductStatus } from '~/types/admin-catalog'
import type { UiTableColumn } from '~/types/ui'

const { can } = useAdminPermissions()
const deleteMutation = useAdminDeleteProductMutation()
const { categoryOptions, brandOptions } = useAdminCatalogLookupsQuery()

const filterCategoryId = ref('')
const filterBrandId = ref('')
const filterStatus = ref('')

const listFilters = computed(() => ({
  categoryId: filterCategoryId.value || undefined,
  brandId: filterBrandId.value || undefined,
  status: (filterStatus.value || undefined) as ProductStatus | undefined,
}))

const {
  page,
  search,
  isPending,
  items: products,
  paginationMeta,
} = usePaginatedAdminList<CatalogProduct>(
  (params) => useAdminProductsQuery(params),
  { filters: listFilters },
)

const statusFilterOptions = [
  { label: 'Todos los estados', value: '' },
  { label: 'Borrador', value: 'DRAFT' },
  { label: 'Activo', value: 'ACTIVE' },
  { label: 'Archivado', value: 'ARCHIVED' },
]

const categoryFilterOptions = computed(() => [
  { label: 'Todas las categorías', value: '' },
  ...categoryOptions.value,
])

const brandFilterOptions = computed(() => [
  { label: 'Todas las marcas', value: '' },
  ...brandOptions.value.filter((option) => option.value),
])

const createOpen = ref(false)
const detailOpen = ref(false)
const editOpen = ref(false)
const selectedProduct = ref<CatalogProduct | null>(null)
const editProductId = ref<string | null>(null)

const columns: UiTableColumn<CatalogProduct>[] = [
  { key: 'name', label: 'Producto' },
  { key: 'primaryCategoryName', label: 'Categoría', width: '10rem' },
  { key: 'brandName', label: 'Marca', width: '9rem' },
  { key: 'defaultPrice', label: 'Precio', width: '8rem' },
  { key: 'status', label: 'Estado', width: '8rem' },
  { key: 'createdAt', label: 'Creado', width: '9rem' },
]

function openDetail(product: CatalogProduct) {
  selectedProduct.value = product
  detailOpen.value = true
}

function openEdit(product: CatalogProduct) {
  editProductId.value = product.id
  editOpen.value = true
}

function openEditFromDetail(productId: string) {
  editProductId.value = productId
  editOpen.value = true
}

function deleteProduct(product: CatalogProduct) {
  return runAdminSuspendAction({
    confirm: {
      title: 'Eliminar producto',
      message: `¿Eliminar "${product.name}"? Esta acción no se puede deshacer.`,
      confirmLabel: 'Eliminar',
    },
    mutate: () => deleteMutation.mutateAsync(product.id),
    successMessage: 'Producto eliminado correctamente',
  })
}
</script>

<template>
  <div>
    <UiFilterBar title="Productos del catálogo">
      <UiSearchInput
        v-model="search"
        placeholder="Buscar por nombre, slug o etiquetas…"
        class="min-w-[16rem] flex-1"
      />
      <UiSelect
        v-model="filterCategoryId"
        :options="categoryFilterOptions"
        placeholder="Categoría"
        class="min-w-[10rem]"
      />
      <UiSelect
        v-model="filterBrandId"
        :options="brandFilterOptions"
        placeholder="Marca"
        class="min-w-[10rem]"
      />
      <UiSelect
        v-model="filterStatus"
        :options="statusFilterOptions"
        placeholder="Estado"
        class="min-w-[10rem]"
      />
      <template #actions>
        <UiButton
          v-if="can('products.write')"
          @click="createOpen = true"
        >
          <UiIcon name="lucide:plus" :size="16" class="mr-2" />
          Nuevo producto
        </UiButton>
      </template>
    </UiFilterBar>

    <AdminCard no-padding>
      <UiDataTable
        :columns="columns"
        :rows="products"
        :loading="isPending"
        empty-title="Sin productos"
        empty-description="Crea el primer producto del catálogo."
      >
        <template #cell-name="{ row }">
          <div class="flex items-center gap-3">
            <div
              class="bg-admin-surface flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg"
            >
              <img
                v-if="row.primaryImageUrl"
                :src="row.primaryImageUrl"
                :alt="row.name"
                class="h-full w-full object-cover"
              />
              <UiIcon
                v-else
                name="lucide:image"
                :size="18"
                class="text-admin-muted"
              />
            </div>
            <div class="min-w-0">
              <p class="truncate font-medium">{{ row.name }}</p>
              <p class="text-admin-muted truncate text-xs">{{ row.slug }}</p>
            </div>
          </div>
        </template>

        <template #cell-brandName="{ row }">
          {{ row.brandName || '—' }}
        </template>

        <template #cell-defaultPrice="{ row }">
          {{ formatPrice(row.defaultPrice) }}
        </template>

        <template #cell-status="{ row }">
          <UiBadge :variant="productStatusVariant(row.status)">
            {{ formatProductStatus(row.status) }}
          </UiBadge>
        </template>

        <template #cell-createdAt="{ row }">
          {{ formatAdminDate(row.createdAt) }}
        </template>

        <template #actions="{ row }">
          <div class="flex justify-end gap-1">
            <UiIconButton
              icon="lucide:eye"
              ariaLabel="Ver detalle"
              @click="openDetail(row)"
            />
            <UiIconButton
              v-if="can('products.write')"
              icon="lucide:pencil"
              ariaLabel="Editar producto"
              @click="openEdit(row)"
            />
            <UiIconButton
              v-if="can('products.write')"
              icon="lucide:trash-2"
              ariaLabel="Eliminar producto"
              @click="deleteProduct(row)"
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

    <AdminProductCreateModal v-if="can('products.write')" v-model="createOpen" />
    <AdminProductDetailModal
      v-model="detailOpen"
      :product="selectedProduct"
      @edit="openEditFromDetail"
    />
    <AdminProductEditModal
      v-if="can('products.write')"
      v-model="editOpen"
      :product-id="editProductId"
    />
  </div>
</template>
