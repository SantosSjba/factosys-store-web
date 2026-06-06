<script setup lang="ts">
import type { CreateCategoryPayload } from '~/types/admin-catalog'
import { createCategorySchema } from '~/utils/validation/schemas'
import { categorySelectOptions } from '~/utils/flatten-category-tree'

const open = defineModel<boolean>({ required: true })

const props = defineProps<{
  defaultParentId?: string
}>()

const createMutation = useAdminCreateCategoryMutation()
const { flatCategories } = useAdminCatalogLookupsQuery()

const parentOptions = computed(() =>
  categorySelectOptions(flatCategories.value),
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

const isSubmitting = withMutationPending(createMutation)

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
    await createMutation.mutateAsync(payload)
    open.value = false
  },
  { successMessage: 'Categoría creada correctamente' },
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
  }
})
</script>

<template>
  <UiModal v-model="open" title="Nueva categoría" size="lg">
    <form class="space-y-4" @submit.prevent="onSubmit">
      <div class="grid gap-4 sm:grid-cols-2">
        <UiFormField name="name" label="Nombre" class="sm:col-span-2" autocomplete="off" />
        <UiFormField name="slug" label="Slug" hint="Opcional" autocomplete="off" />
        <UiFormField name="sortOrder" label="Orden" type="number" min="0" />
        <UiFormSelect name="parentId" label="Categoría padre" :options="parentOptions" />
        <UiFormSelect
          name="isActive"
          label="Estado"
          :options="[
            { label: 'Activa', value: 'true' },
            { label: 'Inactiva', value: 'false' },
          ]"
        />
        <div class="sm:col-span-2">
          <UiFormField name="description" label="Descripción" autocomplete="off" />
        </div>
      </div>
    </form>
    <template #footer>
      <AdminModalFooter
        submit-label="Crear categoría"
        :loading="isSubmitting"
        @cancel="open = false"
        @submit="onSubmit"
      />
    </template>
  </UiModal>
</template>
