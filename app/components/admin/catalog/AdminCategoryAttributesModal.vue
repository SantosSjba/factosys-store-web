<script setup lang="ts">
import type { AssignCategoryAttributesPayload, CatalogCategoryNode } from '~/types/admin-catalog'

const open = defineModel<boolean>({ required: true })

const props = defineProps<{
  category: CatalogCategoryNode | null
}>()

type AttributeRow = {
  attributeId: string
  attributeName: string
  scope: string
  isRequired: boolean
  sortOrder: number
}

const assignMutation = useAdminAssignCategoryAttributesMutation()
const { data: allAttributes, isLoading: attributesLoading } = useAdminAllAttributesQuery()

const categoryId = computed(() => (open.value && props.category ? props.category.id : null))
const { data: categoryDetail, isLoading: categoryLoading } =
  useAdminCategoryDetailQuery(categoryId)

const rows = ref<AttributeRow[]>([])
const selectedAttributeId = ref('')

const isLoading = computed(() => {
  if (!open.value) return false

  return categoryLoading.value || attributesLoading.value
})
const isSubmitting = computed(() => assignMutation.isPending.value)

const availableAttributes = computed(() => {
  const assigned = new Set(rows.value.map((row) => row.attributeId))
  return (allAttributes.value?.items ?? []).filter((attribute) => !assigned.has(attribute.id))
})

const attributeOptions = computed(() =>
  availableAttributes.value.map((attribute) => ({
    label: `${attribute.name} (${attribute.scope === 'PRODUCT' ? 'Producto' : 'Variante'})`,
    value: attribute.id,
  })),
)

function loadRows() {
  if (!categoryDetail.value) {
    rows.value = []
    return
  }

  rows.value = [...categoryDetail.value.attributes]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((entry) => ({
      attributeId: entry.attributeId,
      attributeName: entry.attributeName,
      scope: entry.scope,
      isRequired: entry.isRequired,
      sortOrder: entry.sortOrder,
    }))
}

watch([open, categoryDetail], ([isOpen]) => {
  if (isOpen) loadRows()
  if (!isOpen) {
    rows.value = []
    selectedAttributeId.value = ''
  }
})

function addAttribute() {
  if (!selectedAttributeId.value) return

  const attribute = availableAttributes.value.find(
    (entry) => entry.id === selectedAttributeId.value,
  )
  if (!attribute) return

  rows.value = [
    ...rows.value,
    {
      attributeId: attribute.id,
      attributeName: attribute.name,
      scope: attribute.scope,
      isRequired: attribute.isRequired,
      sortOrder: rows.value.length,
    },
  ]
  selectedAttributeId.value = ''
}

function removeRow(attributeId: string) {
  rows.value = rows.value
    .filter((row) => row.attributeId !== attributeId)
    .map((row, index) => ({ ...row, sortOrder: index }))
}

async function onSubmit() {
  if (!props.category) return

  const payload: AssignCategoryAttributesPayload = {
    attributes: rows.value.map((row, index) => ({
      attributeId: row.attributeId,
      isRequired: row.isRequired,
      sortOrder: index,
    })),
  }

  try {
    await assignMutation.mutateAsync({
      categoryId: props.category.id,
      payload,
    })
    useToast().success('Atributos de categoría actualizados')
    open.value = false
  } catch (error) {
    useToast().error(useApiErrorMessage(error))
  }
}
</script>

<template>
  <UiModal
    v-model="open"
    title="Atributos de categoría"
    :description="category?.name"
    size="xl"
  >
    <div v-if="isLoading" class="text-admin-muted flex items-center justify-center gap-2 py-12 text-sm">
      <UiSpinner size="sm" />
      Cargando atributos…
    </div>

    <div v-else class="space-y-5">
      <AdminFormSection
        title="Agregar atributo"
        description="Selecciona especificaciones del catálogo para esta categoría."
        icon="lucide:plus-circle"
      >
        <div class="flex flex-wrap items-end gap-3">
          <UiSelect
            v-model="selectedAttributeId"
            label="Atributo disponible"
            :options="attributeOptions"
            class="min-w-[16rem] flex-1"
            :disabled="!attributeOptions.length"
          />
          <UiButton
            type="button"
            variant="secondary"
            :disabled="!selectedAttributeId"
            @click="addAttribute"
          >
            <UiIcon name="lucide:plus" :size="14" class="mr-1.5" />
            Agregar
          </UiButton>
        </div>
      </AdminFormSection>

      <AdminFormSection
        title="Atributos asignados"
        description="Marca cuáles son obligatorios al crear productos en esta categoría."
        icon="lucide:list-checks"
      >
        <UiEmptyState
          v-if="!rows.length"
          title="Sin atributos asignados"
          description="Agrega atributos de producto o variante para esta categoría."
        />

        <div v-else class="border-admin-line divide-admin-line divide-y rounded-lg border">
          <div
            v-for="row in rows"
            :key="row.attributeId"
            class="flex flex-wrap items-center justify-between gap-3 p-4"
          >
            <div class="min-w-0">
              <p class="font-medium">{{ row.attributeName }}</p>
              <p class="text-admin-muted text-xs">
                {{ row.scope === 'PRODUCT' ? 'Nivel producto' : 'Nivel variante' }}
              </p>
            </div>

            <div class="flex items-center gap-4">
              <UiCheckbox v-model="row.isRequired" label="Requerido" />
              <UiIconButton
                icon="lucide:trash-2"
                ariaLabel="Quitar atributo"
                @click="removeRow(row.attributeId)"
              />
            </div>
          </div>
        </div>
      </AdminFormSection>
    </div>

    <template #footer>
      <AdminModalFooter
        submit-label="Guardar atributos"
        :loading="isSubmitting"
        :show-submit="!isLoading"
        @cancel="open = false"
        @submit="onSubmit"
      />
    </template>
  </UiModal>
</template>
