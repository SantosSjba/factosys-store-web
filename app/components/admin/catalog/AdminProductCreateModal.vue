<script setup lang="ts">
import { useField } from 'vee-validate'
import {
  buildCreateProductPayload,
  createEmptyVariantRow,
  emptyProductFormValues,
  validateProductFormInput,
  type ProductVariantFormRow,
} from '~/utils/catalog/product-form'
import { productFormSchema } from '~/utils/validation/schemas'

const open = defineModel<boolean>({ required: true })

const createMutation = useAdminCreateProductMutation()
const toast = useToast()

const variants = ref<ProductVariantFormRow[]>([createEmptyVariantRow(true)])
const productAttributeValues = ref<Record<string, string>>({})

const { resetForm, createSubmitHandler, withMutationPending } = useApiForm({
  schema: productFormSchema,
  initialValues: emptyProductFormValues,
})

const { value: primaryCategoryId } = useField<string>('primaryCategoryId')
const { productAttributes, variantAttributes } =
  useAdminCategoryProductAttributes(primaryCategoryId)

const isSubmitting = withMutationPending(createMutation)

const onSubmit = createSubmitHandler(
  async (values) => {
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

    const payload = buildCreateProductPayload(
      values,
      variants.value,
      productAttributeValues.value,
    )

    await createMutation.mutateAsync(payload)
    open.value = false
    resetForm()
    variants.value = [createEmptyVariantRow(true)]
    productAttributeValues.value = {}
  },
  { successMessage: 'Producto creado correctamente' },
)

watch(open, (value) => {
  if (!value) {
    resetForm()
    variants.value = [createEmptyVariantRow(true)]
    productAttributeValues.value = {}
  }
})
</script>

<template>
  <UiModal
    v-model="open"
    title="Nuevo producto"
    description="Producto simple o variable con categorías, atributos y SEO."
    size="full"
  >
    <form @submit.prevent="onSubmit">
      <AdminProductFormBody
        v-model:variants="variants"
        v-model:product-attribute-values="productAttributeValues"
      />
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
