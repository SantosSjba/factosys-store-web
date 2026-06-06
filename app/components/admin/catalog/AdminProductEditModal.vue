<script setup lang="ts">
import type { UpdateProductPayload } from '~/types/admin-catalog'
import { updateProductSchema } from '~/utils/validation/schemas'

const open = defineModel<boolean>({ required: true })
const props = defineProps<{ productId: string | null }>()

const updateMutation = useAdminUpdateProductMutation()
const { categoryOptions, brandOptions } = useAdminCatalogLookupsQuery()

const productIdRef = computed(() => (open.value ? props.productId : null))
const { data: product, isPending, isError } = useAdminProductQuery(productIdRef)

const statusOptions = [
  { label: 'Borrador', value: 'DRAFT' },
  { label: 'Activo', value: 'ACTIVE' },
  { label: 'Archivado', value: 'ARCHIVED' },
]

const { resetForm, setValues, createSubmitHandler, withMutationPending } = useApiForm({
  schema: updateProductSchema,
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

const isSubmitting = withMutationPending(updateMutation)

watch(product, (p) => {
  if (!p) return
  const defaultVariant =
    p.variants.find((variant) => variant.isDefault) ?? p.variants[0]

  setValues({
    name: p.name,
    slug: p.slug,
    shortDescription: p.shortDescription ?? '',
    description: p.description ?? '',
    primaryCategoryId: p.primaryCategoryId,
    brandId: p.brandId ?? '',
    status: p.status,
    sku: defaultVariant?.sku ?? '',
    price: defaultVariant ? Number(defaultVariant.price) : 0,
    compareAtPrice: defaultVariant?.compareAtPrice
      ? Number(defaultVariant.compareAtPrice)
      : undefined,
  })
})

watch(open, (value) => {
  if (!value) resetForm()
})

const onSubmit = createSubmitHandler(
  async (values) => {
    if (!props.productId) return

    const payload: UpdateProductPayload = {
      name: values.name,
      slug: values.slug || undefined,
      shortDescription: values.shortDescription || undefined,
      description: values.description || undefined,
      primaryCategoryId: values.primaryCategoryId,
      brandId: values.brandId || null,
      status: values.status,
      variants: [
        {
          sku: values.sku,
          price: values.price,
          compareAtPrice: values.compareAtPrice,
          isDefault: true,
        },
      ],
    }

    await updateMutation.mutateAsync({ id: props.productId, payload })
    open.value = false
  },
  { successMessage: 'Producto actualizado' },
)
</script>

<template>
  <UiModal
    v-model="open"
    title="Editar producto"
    :description="product?.slug"
    size="xl"
  >
    <div v-if="isPending" class="text-admin-muted py-8 text-center text-sm">
      Cargando producto…
    </div>

    <UiAlert v-else-if="isError" variant="danger">
      No se pudo cargar el producto.
    </UiAlert>

    <div v-else-if="product" class="space-y-6">
      <form class="grid gap-4 sm:grid-cols-2" @submit.prevent="onSubmit">
        <UiFormField name="name" label="Nombre" class="sm:col-span-2" autocomplete="off" />
        <UiFormField name="slug" label="Slug" autocomplete="off" />
        <UiFormField name="sku" label="SKU" autocomplete="off" />
        <UiFormSelect
          name="primaryCategoryId"
          label="Categoría principal"
          :options="categoryOptions"
        />
        <UiFormSelect name="brandId" label="Marca" :options="brandOptions" />
        <UiFormSelect name="status" label="Estado" :options="statusOptions" />
        <UiFormField name="price" label="Precio" type="number" step="0.01" min="0" />
        <UiFormField
          name="compareAtPrice"
          label="Precio comparativo"
          type="number"
          step="0.01"
          min="0"
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
      </form>

      <div class="border-admin-line border-t pt-6">
        <h3 class="mb-4 text-sm font-semibold">Galería de imágenes</h3>
        <AdminProductImagesSection :product-id="product.id" can-write />
      </div>
    </div>

    <template #footer>
      <AdminModalFooter
        submit-label="Guardar cambios"
        :loading="isSubmitting"
        :show-submit="!isPending && !isError"
        @cancel="open = false"
        @submit="onSubmit"
      />
    </template>
  </UiModal>
</template>
