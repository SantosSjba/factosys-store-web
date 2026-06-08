<script setup lang="ts">
import type { EnrichedCategoryAttribute } from '~/utils/catalog/product-form'
import { createEmptyVariantRow, type ProductVariantFormRow } from '~/utils/catalog/product-form'

const variants = defineModel<ProductVariantFormRow[]>({ required: true })

defineProps<{
  variantAttributes: EnrichedCategoryAttribute[]
  disabled?: boolean
  /** Sin encabezado propio cuando va dentro de AdminFormSection */
  embedded?: boolean
}>()

function addVariant() {
  variants.value = [
    ...variants.value,
    createEmptyVariantRow(variants.value.length === 0),
  ]
}

function removeVariant(index: number) {
  const next = variants.value.filter((_, itemIndex) => itemIndex !== index)
  if (next.length > 0 && !next.some((variant) => variant.isDefault)) {
    next[0] = { ...next[0]!, isDefault: true }
  }
  variants.value = next
}

function setDefault(index: number) {
  variants.value = variants.value.map((variant, itemIndex) => ({
    ...variant,
    isDefault: itemIndex === index,
  }))
}

function updateVariant<K extends keyof ProductVariantFormRow>(
  index: number,
  key: K,
  value: ProductVariantFormRow[K],
) {
  const next = [...variants.value]
  next[index] = { ...next[index]!, [key]: value }
  variants.value = next
}

function updateVariantAttribute(index: number, attributeId: string, value: string) {
  const next = [...variants.value]
  const variant = next[index]
  if (!variant) return

  next[index] = {
    ...variant,
    attributeValues: {
      ...variant.attributeValues,
      [attributeId]: value,
    },
  }
  variants.value = next
}
</script>

<template>
  <div class="space-y-4">
    <div
      class="flex items-center justify-end gap-3"
      :class="embedded ? '' : 'flex-wrap items-start justify-between'"
    >
      <div v-if="!embedded">
        <h3 class="text-sm font-semibold">Variantes</h3>
        <p class="text-admin-muted text-xs">
          Cada combinación (color, talla, etc.) con su propio SKU y precio.
        </p>
      </div>
      <UiButton type="button" size="sm" variant="secondary" :disabled="disabled" @click="addVariant">
        <UiIcon name="lucide:plus" :size="14" class="mr-1.5" />
        Agregar variante
      </UiButton>
    </div>

    <UiEmptyState
      v-if="!variants.length"
      title="Sin variantes"
      description="Agrega al menos una variante para el producto variable."
    />

    <div v-else class="space-y-4">
      <div
        v-for="(variant, index) in variants"
        :key="index"
        class="border-admin-line rounded-xl border p-4"
      >
        <div class="mb-4 flex items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <p class="text-sm font-medium">Variante {{ index + 1 }}</p>
            <UiBadge v-if="variant.isDefault" variant="info">Predeterminada</UiBadge>
          </div>
          <div class="flex gap-1">
            <UiButton
              v-if="!variant.isDefault"
              type="button"
              size="sm"
              variant="ghost"
              :disabled="disabled"
              @click="setDefault(index)"
            >
              Marcar predeterminada
            </UiButton>
            <UiIconButton
              icon="lucide:trash-2"
              ariaLabel="Eliminar variante"
              :disabled="disabled || variants.length === 1"
              @click="removeVariant(index)"
            />
          </div>
        </div>

        <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <UiInput
            :model-value="variant.sku"
            label="SKU"
            required
            :disabled="disabled"
            autocomplete="off"
            @update:model-value="updateVariant(index, 'sku', $event)"
          />
          <UiInput
            :model-value="variant.name"
            label="Nombre visible"
            hint="Opcional. Ej: 16GB / Rojo"
            :disabled="disabled"
            autocomplete="off"
            @update:model-value="updateVariant(index, 'name', $event)"
          />
          <UiInput
            :model-value="String(variant.price)"
            label="Precio"
            type="number"
            step="0.01"
            min="0"
            required
            :disabled="disabled"
            @update:model-value="updateVariant(index, 'price', Number($event) || 0)"
          />
          <UiInput
            :model-value="variant.compareAtPrice != null ? String(variant.compareAtPrice) : ''"
            label="Precio comparativo"
            type="number"
            step="0.01"
            min="0"
            :disabled="disabled"
            @update:model-value="
              updateVariant(
                index,
                'compareAtPrice',
                $event === '' ? undefined : Number($event),
              )
            "
          />
          <UiInput
            :model-value="variant.cost != null ? String(variant.cost) : ''"
            label="Costo"
            type="number"
            step="0.01"
            min="0"
            :disabled="disabled"
            @update:model-value="
              updateVariant(index, 'cost', $event === '' ? undefined : Number($event))
            "
          />
          <UiInput
            :model-value="variant.weight != null ? String(variant.weight) : ''"
            label="Peso (kg)"
            type="number"
            step="0.001"
            min="0"
            :disabled="disabled"
            @update:model-value="
              updateVariant(index, 'weight', $event === '' ? undefined : Number($event))
            "
          />
          <UiInput
            :model-value="variant.barcode"
            label="Código de barras"
            :disabled="disabled"
            autocomplete="off"
            @update:model-value="updateVariant(index, 'barcode', $event)"
          />
        </div>

        <div
          v-if="variantAttributes.length"
          class="border-admin-line mt-4 grid gap-4 border-t pt-4 sm:grid-cols-2 xl:grid-cols-3"
        >
          <AdminCatalogAttributeInput
            v-for="attribute in variantAttributes"
            :key="`${index}-${attribute.attributeId}`"
            :attribute="attribute"
            :model-value="variant.attributeValues[attribute.attributeId] ?? ''"
            :disabled="disabled"
            @update:model-value="updateVariantAttribute(index, attribute.attributeId, $event)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
