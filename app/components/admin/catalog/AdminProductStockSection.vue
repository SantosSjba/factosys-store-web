<script setup lang="ts">
import type { CatalogProduct, CatalogProductVariant } from '~/types/admin-catalog'
import type { InventoryStockLevel, VariantLookup } from '~/types/admin-inventory'

const props = defineProps<{
  product: CatalogProduct
}>()

const { can } = useAdminPermissions()
const productIdRef = computed(() => props.product.id)
const { data: stockData, isPending } = useAdminProductStockQuery(productIdRef)

const movementOpen = ref(false)
const reservationOpen = ref(false)
const selectedVariant = ref<VariantLookup | null>(null)
const movementType = ref<'RECEIPT' | 'SHIPMENT' | 'ADJUSTMENT' | 'TRANSFER'>('RECEIPT')

const stockByVariant = computed(() => {
  const map = new Map<string, InventoryStockLevel[]>()
  for (const level of stockData.value?.items ?? []) {
    const current = map.get(level.variantId) ?? []
    current.push(level)
    map.set(level.variantId, current)
  }
  return map
})

function toVariantLookup(variant: CatalogProductVariant): VariantLookup {
  return {
    id: variant.id,
    sku: variant.sku,
    name: variant.name,
    productId: props.product.id,
    productName: props.product.name,
  }
}

function variantTotals(variantId: string) {
  const levels = stockByVariant.value.get(variantId) ?? []
  return levels.reduce(
    (acc, level) => ({
      onHand: acc.onHand + level.quantityOnHand,
      reserved: acc.reserved + level.quantityReserved,
      available: acc.available + level.quantityAvailable,
      isLowStock: acc.isLowStock || level.isLowStock,
    }),
    { onHand: 0, reserved: 0, available: 0, isLowStock: false },
  )
}

function openMovement(variant: CatalogProductVariant, type: typeof movementType.value = 'RECEIPT') {
  selectedVariant.value = toVariantLookup(variant)
  movementType.value = type
  movementOpen.value = true
}

function openReservation(variant: CatalogProductVariant) {
  selectedVariant.value = toVariantLookup(variant)
  reservationOpen.value = true
}

const displayVariants = computed(() =>
  props.product.productType === 'SIMPLE'
    ? props.product.variants.slice(0, 1)
    : props.product.variants,
)
</script>

<template>
  <AdminFormSection
    title="Inventario"
    description="Stock por variante y acciones rápidas."
    icon="lucide:warehouse"
  >
    <UiAlert v-if="!can('inventory.read')" variant="warning">
      Necesitas permiso <code>inventory.read</code> para ver stock.
    </UiAlert>

    <div v-else-if="isPending" class="text-admin-muted flex items-center gap-2 py-4 text-sm">
      <UiSpinner size="sm" />
      Cargando stock…
    </div>

    <div v-else class="overflow-x-auto">
      <table class="min-w-full text-sm">
        <thead class="text-admin-muted text-left text-xs uppercase">
          <tr>
            <th class="pb-2 pr-4">SKU</th>
            <th class="pb-2 pr-4">Disponible</th>
            <th class="pb-2 pr-4">En mano</th>
            <th class="pb-2 pr-4">Reservado</th>
            <th class="pb-2 pr-4">Alerta</th>
            <th v-if="can('inventory.read')" class="pb-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="variant in displayVariants"
            :key="variant.id"
            class="border-admin-line border-t"
          >
            <td class="py-2 pr-4">
              <p class="font-mono text-xs">{{ variant.sku }}</p>
              <p v-if="variant.name" class="text-admin-muted text-xs">{{ variant.name }}</p>
            </td>
            <td class="py-2 pr-4">
              <span
                :class="variantTotals(variant.id).isLowStock ? 'font-semibold text-amber-600' : ''"
              >
                {{ variantTotals(variant.id).available }}
              </span>
            </td>
            <td class="py-2 pr-4">{{ variantTotals(variant.id).onHand }}</td>
            <td class="py-2 pr-4">{{ variantTotals(variant.id).reserved }}</td>
            <td class="py-2 pr-4">
              <UiBadge v-if="variantTotals(variant.id).isLowStock" variant="warning">
                Stock bajo
              </UiBadge>
              <span v-else class="text-admin-muted">—</span>
            </td>
            <td v-if="can('inventory.read')" class="py-2">
              <div class="flex flex-wrap gap-1">
                <UiButton
                  v-if="can('inventory.write')"
                  size="sm"
                  variant="ghost"
                  @click="openMovement(variant, 'RECEIPT')"
                >
                  Entrada
                </UiButton>
                <UiButton
                  v-if="can('inventory.write')"
                  size="sm"
                  variant="ghost"
                  @click="openReservation(variant)"
                >
                  Reservar
                </UiButton>
                <NuxtLink
                  :to="`/intranet/inventario?tab=movements&variantId=${variant.id}`"
                  class="inline-flex"
                >
                  <UiButton size="sm" variant="ghost">Historial</UiButton>
                </NuxtLink>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <p
        v-if="!displayVariants.length"
        class="text-admin-muted py-4 text-sm"
      >
        Este producto no tiene variantes registradas.
      </p>

      <div
        v-if="stockData?.items.length"
        class="text-admin-muted mt-3 text-xs"
      >
        Detalle por almacén:
        <ul class="mt-1 space-y-1">
          <li v-for="level in stockData.items" :key="level.id">
            {{ level.warehouseName }} — {{ level.sku }}: {{ level.quantityAvailable }} disponible
            <span v-if="level.quantityReserved"> ({{ level.quantityReserved }} reservado)</span>
          </li>
        </ul>
      </div>
    </div>

    <template v-if="can('inventory.write')">
      <AdminStockMovementModal
        v-model="movementOpen"
        :initial-variant="selectedVariant"
        :initial-type="movementType"
        lock-variant
      />
      <AdminStockReservationModal
        v-model="reservationOpen"
        :initial-variant="selectedVariant"
        lock-variant
      />
    </template>
  </AdminFormSection>
</template>
