<script setup lang="ts">
import type { CatalogCategoryNode } from '~/types/admin-catalog'

defineOptions({ name: 'AdminCategoryTreeRow' })

defineProps<{
  node: CatalogCategoryNode
  depth?: number
}>()

const emit = defineEmits<{
  edit: [node: CatalogCategoryNode]
  remove: [node: CatalogCategoryNode]
  addChild: [node: CatalogCategoryNode]
}>()

const { can } = useAdminPermissions()
</script>

<template>
  <div>
    <div
      class="border-admin-line flex items-center justify-between gap-3 border-b px-4 py-3"
      :style="{ paddingLeft: `${1 + (depth ?? 0) * 1.25}rem` }"
    >
      <div class="min-w-0 flex-1">
        <p class="font-medium">{{ node.name }}</p>
        <p class="text-admin-muted text-xs">{{ node.slug }}</p>
      </div>
      <UiBadge :variant="node.isActive ? 'success' : 'default'">
        {{ node.isActive ? 'Activa' : 'Inactiva' }}
      </UiBadge>
      <div v-if="can('products.write')" class="flex shrink-0 gap-1">
        <UiIconButton
          icon="lucide:folder-plus"
          ariaLabel="Agregar subcategoría"
          @click="emit('addChild', node)"
        />
        <UiIconButton icon="lucide:pencil" ariaLabel="Editar" @click="emit('edit', node)" />
        <UiIconButton icon="lucide:trash-2" ariaLabel="Eliminar" @click="emit('remove', node)" />
      </div>
    </div>
    <AdminCategoryTreeRow
      v-for="child in node.children"
      :key="child.id"
      :node="child"
      :depth="(depth ?? 0) + 1"
      @edit="emit('edit', $event)"
      @remove="emit('remove', $event)"
      @add-child="emit('addChild', $event)"
    />
  </div>
</template>
