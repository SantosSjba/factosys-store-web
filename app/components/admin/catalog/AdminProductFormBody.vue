<script setup lang="ts">
import { useField } from 'vee-validate'
import type { ProductVariantFormRow } from '~/utils/catalog/product-form'

const variants = defineModel<ProductVariantFormRow[]>('variants', { required: true })
const productAttributeValues = defineModel<Record<string, string>>('productAttributeValues', {
  required: true,
})

defineProps<{
  disabled?: boolean
}>()

const { categoryOptions, brandOptions, flatCategories } = useAdminCatalogLookupsQuery()
const { value: productType } = useField<'SIMPLE' | 'VARIABLE'>('productType')
const { value: primaryCategoryId } = useField<string>('primaryCategoryId')

const { productAttributes, variantAttributes, isLoading } =
  useAdminCategoryProductAttributes(primaryCategoryId)

const statusOptions = [
  { label: 'Borrador', value: 'DRAFT' },
  { label: 'Activo', value: 'ACTIVE' },
  { label: 'Archivado', value: 'ARCHIVED' },
]

const productTypeOptions = [
  { label: 'Simple (un SKU)', value: 'SIMPLE' },
  { label: 'Variable (varias variantes)', value: 'VARIABLE' },
]

const secondaryCategoryOptions = computed(() =>
  flatCategories.value
    .filter((category) => category.id !== primaryCategoryId.value)
    .map((category) => ({
      label: `${'— '.repeat(category.depth)}${category.name}`,
      value: category.id,
    })),
)

const isSimple = computed(() => productType.value === 'SIMPLE')
const isVariable = computed(() => productType.value === 'VARIABLE')
const hasPrimaryCategory = computed(() => Boolean(primaryCategoryId.value?.trim()))
</script>

<template>
  <div class="space-y-5">
    <AdminFormSection
      title="Información general"
      description="Nombre, identificador y descripciones del producto."
      icon="lucide:package"
    >
      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <UiFormField
          name="name"
          label="Nombre"
          class="sm:col-span-2 xl:col-span-3"
          autocomplete="off"
          required
        />
        <UiFormField
          name="slug"
          label="Slug"
          hint="Opcional. Se genera automáticamente."
          autocomplete="off"
        />
        <UiFormField
          name="shortDescription"
          label="Descripción corta"
          class="sm:col-span-2 xl:col-span-3"
          autocomplete="off"
        />
        <UiFormField
          name="description"
          label="Descripción larga"
          class="sm:col-span-2 xl:col-span-3"
          autocomplete="off"
        />
      </div>
    </AdminFormSection>

    <AdminFormSection
      title="Clasificación y estado"
      description="Categoría, marca, tipo de producto y visibilidad en catálogo."
      icon="lucide:layers"
    >
      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <UiFormSelect name="productType" label="Tipo de producto" :options="productTypeOptions" required />
        <UiFormSelect name="status" label="Estado" :options="statusOptions" />
        <UiFormSelect
          name="primaryCategoryId"
          label="Categoría principal"
          :options="categoryOptions"
          required
        />
        <UiFormSelect name="brandId" label="Marca" :options="brandOptions" />
        <UiFormCheckboxGroup
          v-if="secondaryCategoryOptions.length"
          name="categoryIds"
          label="Categorías adicionales"
          :options="secondaryCategoryOptions"
          class="sm:col-span-2 xl:col-span-3"
          hint="Opcional. Otras categorías donde aparecerá el producto."
        />
      </div>
    </AdminFormSection>

    <AdminFormSection
      v-if="isSimple"
      title="Precio y SKU"
      description="Datos comerciales del producto simple."
      icon="lucide:circle-dollar-sign"
    >
      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <UiFormField name="sku" label="SKU" autocomplete="off" required />
        <UiFormField name="price" label="Precio" type="number" step="0.01" min="0" required />
        <UiFormField
          name="compareAtPrice"
          label="Precio comparativo"
          type="number"
          step="0.01"
          min="0"
          hint="Opcional. Precio tachado en tienda."
        />
      </div>
    </AdminFormSection>

    <AdminFormSection
      v-if="isVariable"
      title="Variantes"
      description="Cada combinación (color, talla, etc.) con su propio SKU y precio."
      icon="lucide:boxes"
    >
      <AdminProductVariantsEditor
        v-model="variants"
        :variant-attributes="variantAttributes"
        :disabled="disabled"
        embedded
      />
    </AdminFormSection>

    <AdminFormSection
      v-if="hasPrimaryCategory && isLoading"
      title="Especificaciones"
      description="Atributos definidos para la categoría principal."
      icon="lucide:sliders-horizontal"
    >
      <div class="text-admin-muted flex items-center gap-2 text-sm">
        <UiSpinner size="sm" />
        Cargando atributos de la categoría…
      </div>
    </AdminFormSection>

    <AdminFormSection
      v-else-if="productAttributes.length"
      title="Especificaciones"
      description="Atributos técnicos según la categoría principal seleccionada."
      icon="lucide:sliders-horizontal"
    >
      <AdminProductAttributeFields
        v-model="productAttributeValues"
        :attributes="productAttributes"
        :disabled="disabled"
      />
    </AdminFormSection>

    <AdminFormSection
      title="SEO y etiquetas"
      description="Metadatos para buscadores y organización interna."
      icon="lucide:search"
    >
      <AdminProductSeoFields />
    </AdminFormSection>
  </div>
</template>
