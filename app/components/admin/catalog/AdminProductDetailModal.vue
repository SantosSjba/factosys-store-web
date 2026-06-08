<script setup lang="ts">
import type { CatalogProduct } from '~/types/admin-catalog'

const open = defineModel<boolean>({ required: true })

const props = defineProps<{
  product: CatalogProduct | null
}>()

const emit = defineEmits<{
  edit: [productId: string]
}>()

const { can } = useAdminPermissions()

const productIdRef = computed(() => (open.value && props.product ? props.product.id : null))
const { data: detail, isPending } = useAdminProductQuery(productIdRef)

const displayProduct = computed(() => detail.value ?? props.product)

const defaultVariant = computed(
  () =>
    displayProduct.value?.variants.find((variant) => variant.isDefault) ??
    displayProduct.value?.variants[0] ??
    null,
)

const sortedImages = computed(() =>
  [...(displayProduct.value?.images ?? [])].sort((a, b) => a.sortOrder - b.sortOrder),
)

function requestEdit() {
  if (!displayProduct.value) return
  emit('edit', displayProduct.value.id)
  open.value = false
}
</script>

<template>
  <UiModal
    v-model="open"
    title="Detalle de producto"
    :description="displayProduct?.slug"
    size="full"
  >
    <div
      v-if="isPending && !displayProduct"
      class="text-admin-muted flex items-center justify-center gap-2 py-12 text-sm"
    >
      <UiSpinner size="sm" />
      Cargando producto…
    </div>

    <div v-else-if="displayProduct" class="space-y-5">
      <AdminFormSection
        title="Información general"
        description="Datos principales y descripciones del producto."
        icon="lucide:package"
      >
        <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <AdminDetailCell label="Nombre" class="sm:col-span-2 xl:col-span-3">
            <p class="font-medium">{{ displayProduct.name }}</p>
          </AdminDetailCell>
          <AdminDetailCell label="Estado">
            <UiBadge :variant="productStatusVariant(displayProduct.status)">
              {{ formatProductStatus(displayProduct.status) }}
            </UiBadge>
          </AdminDetailCell>
          <AdminDetailCell label="Tipo">
            <p>{{ displayProduct.productType === 'SIMPLE' ? 'Simple' : 'Variable' }}</p>
          </AdminDetailCell>
          <AdminDetailCell
            v-if="displayProduct.shortDescription"
            label="Descripción corta"
            class="sm:col-span-2 xl:col-span-3"
          >
            <p class="text-sm">{{ displayProduct.shortDescription }}</p>
          </AdminDetailCell>
          <AdminDetailCell
            v-if="displayProduct.description"
            label="Descripción larga"
            class="sm:col-span-2 xl:col-span-3"
          >
            <p class="whitespace-pre-wrap text-sm">{{ displayProduct.description }}</p>
          </AdminDetailCell>
        </div>
      </AdminFormSection>

      <AdminFormSection
        title="Clasificación"
        description="Categoría, marca y ubicación en el catálogo."
        icon="lucide:layers"
      >
        <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <AdminDetailCell label="Categoría principal">
            <p>{{ displayProduct.primaryCategoryName }}</p>
          </AdminDetailCell>
          <AdminDetailCell label="Marca">
            <p>{{ displayProduct.brandName || '—' }}</p>
          </AdminDetailCell>
          <AdminDetailCell
            v-if="displayProduct.categoryIds.length"
            label="Categorías adicionales"
          >
            <p class="text-sm">{{ displayProduct.categoryIds.length }} asignadas</p>
          </AdminDetailCell>
        </div>
      </AdminFormSection>

      <AdminFormSection
        v-if="displayProduct.productType === 'SIMPLE'"
        title="Precio y SKU"
        description="Datos comerciales de la variante principal."
        icon="lucide:circle-dollar-sign"
      >
        <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <AdminDetailCell label="SKU">
            <p class="font-mono text-sm">{{ defaultVariant?.sku || '—' }}</p>
          </AdminDetailCell>
          <AdminDetailCell label="Precio">
            <p class="font-medium">{{ formatPrice(defaultVariant?.price) }}</p>
          </AdminDetailCell>
          <AdminDetailCell v-if="defaultVariant?.compareAtPrice" label="Precio comparativo">
            <p class="text-admin-muted line-through">
              {{ formatPrice(defaultVariant.compareAtPrice) }}
            </p>
          </AdminDetailCell>
        </div>
      </AdminFormSection>

      <AdminFormSection
        v-if="displayProduct.productType === 'VARIABLE' && displayProduct.variants.length"
        title="Variantes"
        description="Combinaciones disponibles con SKU y precio propios."
        icon="lucide:boxes"
      >
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead class="text-admin-muted text-left text-xs uppercase">
              <tr>
                <th class="pb-2 pr-4">SKU</th>
                <th class="pb-2 pr-4">Nombre</th>
                <th class="pb-2 pr-4">Precio</th>
                <th class="pb-2">Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="variant in displayProduct.variants"
                :key="variant.id"
                class="border-admin-line border-t"
              >
                <td class="py-2 pr-4 font-mono text-xs">{{ variant.sku }}</td>
                <td class="py-2 pr-4">{{ variant.name || '—' }}</td>
                <td class="py-2 pr-4">{{ formatPrice(variant.price) }}</td>
                <td class="py-2">
                  <UiBadge :variant="variant.isActive ? 'success' : 'default'">
                    {{
                      variant.isDefault
                        ? 'Predeterminada'
                        : variant.isActive
                          ? 'Activa'
                          : 'Inactiva'
                    }}
                  </UiBadge>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </AdminFormSection>

      <AdminFormSection
        v-if="displayProduct.attributeValues.length"
        title="Especificaciones"
        description="Atributos técnicos del producto."
        icon="lucide:sliders-horizontal"
      >
        <dl class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <AdminDetailCell
            v-for="entry in displayProduct.attributeValues"
            :key="entry.attributeId"
            :label="entry.attributeName"
          >
            <p class="font-medium">{{ entry.value }}</p>
          </AdminDetailCell>
        </dl>
      </AdminFormSection>

      <AdminFormSection
        v-if="displayProduct.metaTitle || displayProduct.metaDescription || displayProduct.tags.length"
        title="SEO y etiquetas"
        description="Metadatos y etiquetas internas."
        icon="lucide:search"
      >
        <div class="grid gap-4 sm:grid-cols-2">
          <AdminDetailCell v-if="displayProduct.metaTitle" label="Meta título" class="sm:col-span-2">
            <p class="text-sm">{{ displayProduct.metaTitle }}</p>
          </AdminDetailCell>
          <AdminDetailCell
            v-if="displayProduct.metaDescription"
            label="Meta descripción"
            class="sm:col-span-2"
          >
            <p class="text-sm">{{ displayProduct.metaDescription }}</p>
          </AdminDetailCell>
          <AdminDetailCell v-if="displayProduct.tags.length" label="Etiquetas" class="sm:col-span-2">
            <div class="flex flex-wrap gap-1.5">
              <UiChip v-for="tag in displayProduct.tags" :key="tag" :label="tag" />
            </div>
          </AdminDetailCell>
        </div>
      </AdminFormSection>

      <AdminFormSection
        v-if="sortedImages.length"
        title="Galería de imágenes"
        description="Vista previa de las imágenes del producto."
        icon="lucide:images"
      >
        <div class="grid grid-cols-3 gap-2 sm:grid-cols-4 xl:grid-cols-6">
          <div
            v-for="image in sortedImages"
            :key="image.id"
            class="border-admin-line relative overflow-hidden rounded-lg border"
          >
            <img
              :src="image.url"
              :alt="image.alt || displayProduct.name"
              class="aspect-square w-full object-cover"
            />
            <span
              v-if="image.isPrimary"
              class="bg-brand-accent/90 absolute left-1 top-1 rounded px-1.5 py-0.5 text-[9px] font-medium text-white"
            >
              Principal
            </span>
          </div>
        </div>
      </AdminFormSection>
    </div>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UiButton variant="ghost" @click="open = false">Cerrar</UiButton>
        <UiButton v-if="can('products.write') && displayProduct" @click="requestEdit">
          <UiIcon name="lucide:pencil" :size="16" class="mr-2" />
          Editar
        </UiButton>
      </div>
    </template>
  </UiModal>
</template>
