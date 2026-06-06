<script setup lang="ts">
import type { CreateProductPayload } from '~/types/admin-catalog'
import { createProductSchema } from '~/utils/validation/schemas'

const open = defineModel<boolean>({ required: true })

const createMutation = useAdminCreateProductMutation()
const { categoryOptions, brandOptions } = useAdminCatalogLookupsQuery()

const statusOptions = [
  { label: 'Borrador', value: 'DRAFT' },
  { label: 'Activo', value: 'ACTIVE' },
  { label: 'Archivado', value: 'ARCHIVED' },
]

const { resetForm, createSubmitHandler, withMutationPending } = useApiForm({
  schema: createProductSchema,
  initialValues: {
    name: '',
    slug: '',
    shortDescription: '',
    description: '',
    primaryCategoryId: '',
    brandId: '',
    status: 'DRAFT' as const,
    sku: '',
    price: 0,
    compareAtPrice: undefined as number | undefined,
  },
})

const isSubmitting = withMutationPending(createMutation)

const onSubmit = createSubmitHandler(
  async (values) => {
    const payload: CreateProductPayload = {
      name: values.name,
      shortDescription: values.shortDescription || undefined,
      description: values.description || undefined,
      slug: values.slug || undefined,
      primaryCategoryId: values.primaryCategoryId,
      brandId: values.brandId || undefined,
      status: values.status,
      productType: 'SIMPLE',
      variants: [
        {
          sku: values.sku,
          price: values.price,
          compareAtPrice: values.compareAtPrice,
          isDefault: true,
        },
      ],
    }

    await createMutation.mutateAsync(payload)
    open.value = false
    resetForm()
  },
  { successMessage: 'Producto creado correctamente' },
)

watch(open, (value) => {
  if (!value) resetForm()
})
</script>

<template>
  <UiModal
    v-model="open"
    title="Nuevo producto"
    description="Crea un producto simple con una variante (SKU y precio)."
    size="lg"
  >
    <form class="space-y-4" @submit.prevent="onSubmit">
      <div class="grid gap-4 sm:grid-cols-2">
        <UiFormField name="name" label="Nombre" class="sm:col-span-2" autocomplete="off" />
        <UiFormField name="slug" label="Slug" hint="Opcional. Se genera automáticamente." autocomplete="off" />
        <UiFormField name="sku" label="SKU" autocomplete="off" />
        <UiFormSelect
          name="primaryCategoryId"
          label="Categoría principal"
          :options="categoryOptions"
        />
        <UiFormSelect
          name="brandId"
          label="Marca"
          :options="brandOptions"
        />
        <UiFormSelect name="status" label="Estado" :options="statusOptions" />
        <UiFormField
          name="price"
          label="Precio"
          type="number"
          step="0.01"
          min="0"
        />
        <UiFormField
          name="compareAtPrice"
          label="Precio comparativo"
          type="number"
          step="0.01"
          min="0"
          hint="Opcional. Precio tachado en tienda."
        />
        <UiFormField
          name="shortDescription"
          label="Descripción corta"
          class="sm:col-span-2"
          autocomplete="off"
        />
        <UiFormField
          name="description"
          label="Descripción larga"
          class="sm:col-span-2"
          autocomplete="off"
        />
      </div>
    </form>

    <template #footer>
      <AdminModalFooter
        submit-label="Crear producto"
        :loading="isSubmitting"
        @cancel="open = false"
        @submit="onSubmit"
      />
    </template>
  </UiModal>
</template>
