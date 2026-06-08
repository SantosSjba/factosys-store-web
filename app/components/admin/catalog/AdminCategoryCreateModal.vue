<script setup lang="ts">
import type { CreateCategoryPayload } from '~/types/admin-catalog'
import { createCategorySchema } from '~/utils/validation/schemas'
import { categorySelectOptions } from '~/utils/flatten-category-tree'

const open = defineModel<boolean>({ required: true })

const props = defineProps<{
  defaultParentId?: string
}>()

const createMutation = useAdminCreateCategoryMutation()
const uploadImageMutation = useAdminUploadCategoryImageMutation()
const imageFile = ref<File | null>(null)
const { flatCategories } = useAdminCatalogLookupsQuery()

const parentOptions = computed(() =>
  categorySelectOptions(flatCategories.value),
)

const { resetForm, setValues, createSubmitHandler } = useApiForm({
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

const isSubmitting = computed(
  () => createMutation.isPending.value || uploadImageMutation.isPending.value,
)

const submitLabel = computed(() => {
  if (uploadImageMutation.isPending.value) return 'Subiendo imagen…'
  if (createMutation.isPending.value) return 'Creando categoría…'
  return 'Crear categoría'
})

const onSubmit = createSubmitHandler(
  async (values) => {
    const payload: CreateCategoryPayload = {
      name: values.name,
      slug: values.slug,
      description: values.description,
      parentId: values.parentId || undefined,
      sortOrder: values.sortOrder,
      isActive: values.isActive === 'true',
    }
    const category = await createMutation.mutateAsync(payload)

    if (imageFile.value) {
      await uploadImageMutation.mutateAsync({
        categoryId: category.id,
        file: imageFile.value,
      })
    }

    open.value = false
  },
  {
    successMessage: () =>
      imageFile.value
        ? 'Categoría creada e imagen subida correctamente'
        : 'Categoría creada correctamente',
  },
)

watch(open, (value) => {
  if (value) {
    setValues({
      name: '',
      slug: '',
      description: '',
      parentId: props.defaultParentId ?? '',
      sortOrder: 0,
      isActive: 'true',
    })
  } else {
    resetForm()
    imageFile.value = null
  }
})
</script>

<template>
  <UiModal
    v-model="open"
    title="Nueva categoría"
    description="Organiza el catálogo en una estructura jerárquica."
    size="lg"
  >
    <form class="space-y-5" @submit.prevent="onSubmit">
      <AdminFormSection
        title="Datos básicos"
        description="Nombre, identificador y descripción de la categoría."
        icon="lucide:folder"
      >
        <div class="grid gap-4 sm:grid-cols-2">
          <UiFormField name="name" label="Nombre" class="sm:col-span-2" autocomplete="off" required />
          <UiFormField name="slug" label="Slug" hint="Opcional" autocomplete="off" />
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
          v-model:pending-file="imageFile"
          kind="category-image"
          :disabled="isSubmitting"
        />
      </AdminFormSection>
    </form>

    <template #footer>
      <AdminModalFooter
        :submit-label="submitLabel"
        :loading="isSubmitting"
        @cancel="open = false"
        @submit="onSubmit"
      />
    </template>
  </UiModal>
</template>
