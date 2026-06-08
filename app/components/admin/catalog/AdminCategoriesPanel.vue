<script setup lang="ts">
import type { CatalogCategoryNode } from '~/types/admin-catalog'

const { can } = useAdminPermissions()
const deleteMutation = useAdminDeleteCategoryMutation()
const { data: tree, isPending, isError, error } = useAdminCategoryTreeQuery()

useQueryErrorToast(isError, error)

const createOpen = ref(false)
const editOpen = ref(false)
const attributesOpen = ref(false)
const defaultParentId = ref<string | undefined>()
const selectedCategory = ref<CatalogCategoryNode | null>(null)
const attributesCategory = ref<CatalogCategoryNode | null>(null)

function openCreate(parentId?: string) {
  defaultParentId.value = parentId
  createOpen.value = true
}

function openEdit(node: CatalogCategoryNode) {
  selectedCategory.value = node
  editOpen.value = true
}

function openAttributes(node: CatalogCategoryNode) {
  attributesCategory.value = node
  attributesOpen.value = true
}

function removeCategory(node: CatalogCategoryNode) {
  return runAdminSuspendAction({
    confirm: {
      title: 'Eliminar categoría',
      message: `¿Eliminar "${node.name}"? Debe estar vacía (sin hijos ni productos).`,
      confirmLabel: 'Eliminar',
    },
    mutate: () => deleteMutation.mutateAsync(node.id),
    successMessage: 'Categoría eliminada',
  })
}
</script>

<template>
  <div>
    <UiFilterBar title="Categorías del catálogo">
      <p class="text-admin-muted text-sm">
        Estructura jerárquica para tecnología, ropa y futuras líneas de producto.
      </p>
      <template #actions>
        <UiButton v-if="can('products.write')" @click="openCreate()">
          <UiIcon name="lucide:folder-plus" :size="16" class="mr-2" />
          Nueva categoría
        </UiButton>
      </template>
    </UiFilterBar>

    <AdminCard no-padding>
      <div v-if="isPending" class="text-admin-muted p-6 text-sm">Cargando categorías…</div>
      <UiEmptyState
        v-else-if="!tree?.length"
        title="Sin categorías"
        description="Crea la primera categoría del catálogo."
      />
      <div v-else>
        <AdminCategoryTreeRow
          v-for="node in tree"
          :key="node.id"
          :node="node"
          @edit="openEdit"
          @remove="removeCategory"
          @add-child="openCreate($event.id)"
          @attributes="openAttributes"
        />
      </div>
    </AdminCard>

    <AdminCategoryCreateModal v-if="can('products.write')" v-model="createOpen" :default-parent-id="defaultParentId" />
    <AdminCategoryEditModal v-if="can('products.write')" v-model="editOpen" :category="selectedCategory" />
    <AdminCategoryAttributesModal
      v-if="can('products.write')"
      v-model="attributesOpen"
      :category="attributesCategory"
    />
  </div>
</template>
