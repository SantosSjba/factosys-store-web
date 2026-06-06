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
    size="lg"
  >
    <div v-if="isPending && !displayProduct" class="text-admin-muted py-8 text-center text-sm">
      Cargando…
    </div>

    <div v-else-if="displayProduct" class="space-y-6">
      <div class="grid gap-4 sm:grid-cols-2">
        <AdminDetailCell label="Nombre">
          <p class="font-medium">{{ displayProduct.name }}</p>
        </AdminDetailCell>
        <AdminDetailCell label="Estado">
          <UiBadge :variant="productStatusVariant(displayProduct.status)">
            {{ formatProductStatus(displayProduct.status) }}
          </UiBadge>
        </AdminDetailCell>
        <AdminDetailCell label="Categoría">
          <p>{{ displayProduct.primaryCategoryName }}</p>
        </AdminDetailCell>
        <AdminDetailCell label="Marca">
          <p>{{ displayProduct.brandName || '—' }}</p>
        </AdminDetailCell>
        <AdminDetailCell label="SKU">
          <p class="font-mono text-sm">{{ defaultVariant?.sku || '—' }}</p>
        </AdminDetailCell>
        <AdminDetailCell label="Precio">
          <p class="font-medium">{{ formatPrice(defaultVariant?.price) }}</p>
        </AdminDetailCell>
        <AdminDetailCell label="Tipo" class="sm:col-span-2">
          <p>{{ displayProduct.productType === 'SIMPLE' ? 'Simple' : 'Variable' }}</p>
        </AdminDetailCell>
        <AdminDetailCell
          v-if="displayProduct.shortDescription"
          label="Descripción corta"
          class="sm:col-span-2"
        >
          <p class="text-sm">{{ displayProduct.shortDescription }}</p>
        </AdminDetailCell>
        <AdminDetailCell
          v-if="displayProduct.description"
          label="Descripción"
          class="sm:col-span-2"
        >
          <p class="whitespace-pre-wrap text-sm">{{ displayProduct.description }}</p>
        </AdminDetailCell>
      </div>

      <div v-if="sortedImages.length" class="border-admin-line border-t pt-4">
        <p class="text-admin-muted mb-3 text-xs font-medium uppercase">Imágenes</p>
        <div class="grid grid-cols-3 gap-2 sm:grid-cols-4">
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
      </div>
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
