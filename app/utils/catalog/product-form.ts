import type {
  AttributeDataType,
  AttributeScope,
  CatalogAttribute,
  CreateProductPayload,
  ProductType,
  UpdateProductPayload,
} from '~/types/admin-catalog'

export type ProductVariantFormRow = {
  sku: string
  name: string
  price: number
  compareAtPrice?: number
  barcode: string
  isDefault: boolean
  isActive: boolean
  attributeValues: Record<string, string>
}

export type EnrichedCategoryAttribute = {
  attributeId: string
  attributeName: string
  attributeSlug: string
  scope: AttributeScope
  dataType: AttributeDataType
  isRequired: boolean
  sortOrder: number
  unit: string | null
  options: string[]
}

export type ProductFormValues = {
  name: string
  slug: string
  shortDescription: string
  description: string
  primaryCategoryId: string
  brandId: string
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED'
  productType: ProductType
  categoryIds: string[]
  metaTitle: string
  metaDescription: string
  tagsText: string
  sku: string
  price: number
  compareAtPrice?: number
}

export const emptyProductFormValues: ProductFormValues = {
  name: '',
  slug: '',
  shortDescription: '',
  description: '',
  primaryCategoryId: '',
  brandId: '',
  status: 'DRAFT',
  productType: 'SIMPLE',
  categoryIds: [],
  metaTitle: '',
  metaDescription: '',
  tagsText: '',
  sku: '',
  price: 0,
  compareAtPrice: undefined,
}

export function createEmptyVariantRow(isDefault = false): ProductVariantFormRow {
  return {
    sku: '',
    name: '',
    price: 0,
    compareAtPrice: undefined,
    barcode: '',
    isDefault,
    isActive: true,
    attributeValues: {},
  }
}

export function parseTagsText(tagsText: string): string[] {
  return tagsText
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
}

export function formatTagsText(tags: string[]): string {
  return tags.join(', ')
}

export function mapAttributeValuesRecord(
  entries: Array<{ attributeId: string; value: string }>,
): Record<string, string> {
  return Object.fromEntries(entries.map((entry) => [entry.attributeId, entry.value]))
}

export function toAttributeValuePayload(
  values: Record<string, string>,
): Array<{ attributeId: string; value: string }> {
  return Object.entries(values)
    .filter(([, value]) => value.trim())
    .map(([attributeId, value]) => ({ attributeId, value: value.trim() }))
}

export function enrichCategoryAttributes(
  categoryAttributes: Array<{
    attributeId: string
    attributeName: string
    attributeSlug: string
    scope: AttributeScope
    dataType: AttributeDataType
    isRequired: boolean
    sortOrder: number
  }>,
  definitions: CatalogAttribute[],
): EnrichedCategoryAttribute[] {
  const definitionMap = new Map(definitions.map((item) => [item.id, item]))

  return categoryAttributes
    .map((entry) => {
      const definition = definitionMap.get(entry.attributeId)
      if (!definition) return null

      return {
        ...entry,
        unit: definition.unit,
        options: definition.options,
      }
    })
    .filter((entry): entry is EnrichedCategoryAttribute => entry !== null)
    .sort((a, b) => a.sortOrder - b.sortOrder)
}

export function validateProductFormInput(
  values: ProductFormValues,
  variants: ProductVariantFormRow[],
  productAttributes: EnrichedCategoryAttribute[],
  productAttributeValues: Record<string, string>,
  variantAttributes: EnrichedCategoryAttribute[],
): string | null {
  if (values.productType === 'SIMPLE') {
    if (!values.sku.trim()) return 'Ingresa el SKU del producto.'
    if (Number.isNaN(values.price) || values.price < 0) {
      return 'Ingresa un precio válido.'
    }
  } else {
    if (variants.length === 0) return 'Agrega al menos una variante.'

    for (const [index, variant] of variants.entries()) {
      if (!variant.sku.trim()) {
        return `La variante ${index + 1} debe tener SKU.`
      }
      if (Number.isNaN(variant.price) || variant.price < 0) {
        return `La variante ${index + 1} debe tener un precio válido.`
      }

      for (const attribute of variantAttributes) {
        if (attribute.isRequired && !variant.attributeValues[attribute.attributeId]?.trim()) {
          return `Completa "${attribute.attributeName}" en la variante ${index + 1}.`
        }
      }
    }

    const defaultCount = variants.filter((variant) => variant.isDefault).length
    if (defaultCount !== 1) {
      return 'Marca exactamente una variante como predeterminada.'
    }
  }

  for (const attribute of productAttributes) {
    if (attribute.isRequired && !productAttributeValues[attribute.attributeId]?.trim()) {
      return `Completa el atributo "${attribute.attributeName}".`
    }
  }

  return null
}

function buildVariantsPayload(
  values: ProductFormValues,
  variants: ProductVariantFormRow[],
): CreateProductPayload['variants'] {
  if (values.productType === 'SIMPLE') {
    return [
      {
        sku: values.sku.trim(),
        price: values.price,
        compareAtPrice: values.compareAtPrice,
        isDefault: true,
      },
    ]
  }

  return variants.map((variant, index) => ({
    sku: variant.sku.trim(),
    name: variant.name.trim() || undefined,
    barcode: variant.barcode.trim() || undefined,
    price: variant.price,
    compareAtPrice: variant.compareAtPrice,
    isDefault: variant.isDefault,
    isActive: variant.isActive,
    sortOrder: index,
    attributeValues: toAttributeValuePayload(variant.attributeValues),
  }))
}

export function buildCreateProductPayload(
  values: ProductFormValues,
  variants: ProductVariantFormRow[],
  productAttributeValues: Record<string, string>,
): CreateProductPayload {
  const secondaryCategoryIds = values.categoryIds.filter(
    (id) => id && id !== values.primaryCategoryId,
  )

  return {
    name: values.name.trim(),
    slug: values.slug.trim() || undefined,
    shortDescription: values.shortDescription.trim() || undefined,
    description: values.description.trim() || undefined,
    primaryCategoryId: values.primaryCategoryId,
    brandId: values.brandId || undefined,
    productType: values.productType,
    status: values.status,
    metaTitle: values.metaTitle.trim() || undefined,
    metaDescription: values.metaDescription.trim() || undefined,
    tags: parseTagsText(values.tagsText),
    categoryIds: secondaryCategoryIds,
    attributeValues: toAttributeValuePayload(productAttributeValues),
    variants: buildVariantsPayload(values, variants),
  }
}

export function buildUpdateProductPayload(
  values: ProductFormValues,
  variants: ProductVariantFormRow[],
  productAttributeValues: Record<string, string>,
): UpdateProductPayload {
  const createPayload = buildCreateProductPayload(values, variants, productAttributeValues)

  return {
    name: createPayload.name,
    slug: createPayload.slug,
    shortDescription: createPayload.shortDescription,
    description: createPayload.description,
    primaryCategoryId: createPayload.primaryCategoryId,
    brandId: createPayload.brandId || null,
    productType: createPayload.productType,
    status: createPayload.status,
    metaTitle: createPayload.metaTitle,
    metaDescription: createPayload.metaDescription,
    tags: createPayload.tags,
    categoryIds: createPayload.categoryIds,
    attributeValues: createPayload.attributeValues,
    variants: createPayload.variants,
  }
}
