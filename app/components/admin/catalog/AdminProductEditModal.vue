<script setup lang="ts">
import { useField } from 'vee-validate'
import {
  buildUpdateProductPayload,
  createEmptyVariantRow,
  emptyProductFormValues,
  formatTagsText,
  mapAttributeValuesRecord,
  validateProductFormInput,
  type ProductVariantFormRow,
} from '~/utils/catalog/product-form'
import { productFormSchema } from '~/utils/validation/schemas'

const open = defineModel<boolean>({ required: true })
const props = defineProps<{ productId: string | null }>()

const updateMutation = useAdminUpdateProductMutation()
const toast = useToast()

const productIdRef = computed(() => (open.value ? props.productId : null))
const { data: product, isPending, isError } = useAdminProductQuery(productIdRef)

const variants = ref<ProductVariantFormRow[]>([createEmptyVariantRow(true)])
const productAttributeValues = ref<Record<string, string>>({})

const { resetForm, setValues, createSubmitHandler, withMutationPending } = useApiForm({
  schema: productFormSchema,
  initialValues: emptyProductFormValues,
})

const { value: primaryCategoryId } = useField<string>('primaryCategoryId')
const { productAttributes, variantAttributes } =
  useAdminCategoryProductAttributes(primaryCategoryId)

const isSubmitting = withMutationPending(updateMutation)

function loadProductIntoForm() {
  const current = product.value
  if (!current) return

  const defaultVariant =
    current.variants.find((variant) => variant.isDefault) ?? current.variants[0]

  setValues({
    name: current.name,
    slug: current.slug,
    shortDescription: current.shortDescription ?? '',
    description: current.description ?? '',
    primaryCategoryId: current.primaryCategoryId,
    brandId: current.brandId ?? '',
    status: current.status,
    productType: current.productType,
    categoryIds: current.categoryIds.filter((id) => id !== current.primaryCategoryId),
    metaTitle: current.metaTitle ?? '',
    metaDescription: current.metaDescription ?? '',
    tagsText: formatTagsText(current.tags),
    sku: defaultVariant?.sku ?? '',
    barcode: defaultVariant?.barcode ?? '',
    price: defaultVariant ? Number(defaultVariant.price) : 0,
    compareAtPrice: defaultVariant?.compareAtPrice
      ? Number(defaultVariant.compareAtPrice)
      : undefined,
    cost: defaultVariant?.cost ? Number(defaultVariant.cost) : undefined,
    weight: defaultVariant?.weight ? Number(defaultVariant.weight) : undefined,
  })

  productAttributeValues.value = mapAttributeValuesRecord(current.attributeValues)

  variants.value =
    current.productType === 'VARIABLE' && current.variants.length > 0
      ? current.variants.map((variant) => ({
          id: variant.id,
          sku: variant.sku,
          name: variant.name ?? '',
          price: Number(variant.price),
          compareAtPrice: variant.compareAtPrice
            ? Number(variant.compareAtPrice)
            : undefined,
          cost: variant.cost ? Number(variant.cost) : undefined,
          weight: variant.weight ? Number(variant.weight) : undefined,
          barcode: variant.barcode ?? '',
          isDefault: variant.isDefault,
          isActive: variant.isActive,
          attributeValues: mapAttributeValuesRecord(variant.attributeValues),
        }))
      : defaultVariant
        ? [
            {
              id: defaultVariant.id,
              sku: defaultVariant.sku,
              name: defaultVariant.name ?? '',
              price: Number(defaultVariant.price),
              compareAtPrice: defaultVariant.compareAtPrice
                ? Number(defaultVariant.compareAtPrice)
                : undefined,
              cost: defaultVariant.cost ? Number(defaultVariant.cost) : undefined,
              weight: defaultVariant.weight ? Number(defaultVariant.weight) : undefined,
              barcode: defaultVariant.barcode ?? '',
              isDefault: true,
              isActive: defaultVariant.isActive,
              attributeValues: mapAttributeValuesRecord(defaultVariant.attributeValues),
            },
          ]
        : [createEmptyVariantRow(true)]
}

watch(product, (current) => {
  if (current) loadProductIntoForm()
})

watch(open, (value) => {
  if (value && product.value) loadProductIntoForm()
  if (!value) {
    resetForm()
    variants.value = [createEmptyVariantRow(true)]
    productAttributeValues.value = {}
  }
})

const onSubmit = createSubmitHandler(
  async (values) => {
    if (!props.productId) return

    const validationError = validateProductFormInput(
      values,
      variants.value,
      productAttributes.value,
      productAttributeValues.value,
      variantAttributes.value,
    )

    if (validationError) {
      toast.warning(validationError)
      return
    }

    const payload = buildUpdateProductPayload(
      values,
      variants.value,
      productAttributeValues.value,
    )

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
    size="full"
  >
    <div v-if="isPending" class="text-admin-muted py-8 text-center text-sm">
      Cargando producto…
    </div>

    <UiAlert v-else-if="isError" variant="error">
      No se pudo cargar el producto.
    </UiAlert>

    <div v-else-if="product" class="space-y-6">
      <form @submit.prevent="onSubmit">
        <AdminProductFormBody
          v-model:variants="variants"
          v-model:product-attribute-values="productAttributeValues"
        />
      </form>

      <AdminFormSection
        title="Galería de imágenes"
        description="Sube, ordena y marca la imagen principal del producto."
        icon="lucide:images"
      >
        <AdminProductImagesSection :product-id="product.id" can-write />
      </AdminFormSection>
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
