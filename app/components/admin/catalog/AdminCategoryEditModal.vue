<script setup lang="ts">
import type { CatalogCategory, UpdateCategoryPayload } from '~/types/admin-catalog'
import { createCategorySchema } from '~/utils/validation/schemas'
import { categorySelectOptions } from '~/utils/flatten-category-tree'

const open = defineModel<boolean>({ required: true })

const props = defineProps<{
  category: CatalogCategory | null
}>()

const updateMutation = useAdminUpdateCategoryMutation()
const { flatCategories } = useAdminCatalogLookupsQuery()

const parentOptions = computed(() =>
  categorySelectOptions(flatCategories.value, props.category?.id),
)

const { resetForm, setValues, createSubmitHandler, withMutationPending } = useApiForm({
  schema: createCategorySchema,
  initialValues: {
    name: '',
    slug: '',
    description: '',
    parentId: '',
    sortOrder: 0,
    isActive: 'true' as const,
  },
})

const isSubmitting = withMutationPending(updateMutation)

function loadCategory(category: CatalogCategory) {
  setValues({
    name: category.name,
    slug: category.slug,
    description: category.description ?? '',
    parentId: category.parentId ?? '',
    sortOrder: category.sortOrder,
    isActive: category.isActive ? 'true' : 'false',
  })
}

watch(() => props.category, (c) => { if (c) loadCategory(c) }, { immediate: true })
watch(open, (v) => { if (v && props.category) loadCategory(props.category); if (!v) resetForm() })

const onSubmit = createSubmitHandler(
  async (values) => {
    if (!props.category) return
    const payload: UpdateCategoryPayload = {
      name: values.name,
      slug: values.slug,
      description: values.description,
      parentId: values.parentId || undefined,
      sortOrder: values.sortOrder,
      isActive: values.isActive === 'true',
    }
    await updateMutation.mutateAsync({ id: props.category.id, payload })
    open.value = false
  },
  { successMessage: 'Categoría actualizada' },
)
</script>

<template>
  <UiModal v-model="open" title="Editar categoría" :description="category?.slug" size="lg">
    <form v-if="category" class="space-y-5" @submit.prevent="onSubmit">
      <AdminFormSection
        title="Datos básicos"
        description="Nombre, identificador y descripción de la categoría."
        icon="lucide:folder"
      >
        <div class="grid gap-4 sm:grid-cols-2">
          <UiFormField name="name" label="Nombre" class="sm:col-span-2" autocomplete="off" required />
          <UiFormField name="slug" label="Slug" autocomplete="off" />
          <UiFormField name="description" label="Descripción" class="sm:col-span-2" autocomplete="off" />
        </div>
      </AdminFormSection>

      <AdminFormSection
        title="Jerarquía y estado"
        description="Ubicación en el árbol y visibilidad en tienda."
        icon="lucide:folder-tree"
      >
        <div class="grid gap-4 sm:grid-cols-2">
          <UiFormSelect name="parentId" label="Categoría padre" :options="parentOptions" />
          <UiFormField name="sortOrder" label="Orden" type="number" min="0" />
          <UiFormSelect
            name="isActive"
            label="Estado"
            :options="[
              { label: 'Activa', value: 'true' },
              { label: 'Inactiva', value: 'false' },
            ]"
          />
        </div>
      </AdminFormSection>

      <AdminFormSection
        title="Imagen de categoría"
        description="Icono o banner representativo en la tienda."
        icon="lucide:image"
      >
        <AdminCatalogAssetUpload
          :entity-id="category.id"
          kind="category-image"
          :image-url="category.imageUrl"
          :disabled="isSubmitting"
        />
      </AdminFormSection>
    </form>

    <template #footer>
      <AdminModalFooter submit-label="Guardar" :loading="isSubmitting" @cancel="open = false" @submit="onSubmit" />
    </template>
  </UiModal>
</template>
