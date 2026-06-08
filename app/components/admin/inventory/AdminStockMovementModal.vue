<script setup lang="ts">
import { useField } from 'vee-validate'
import { lookupAdminVariants } from '~/api/admin-inventory.api'
import type { CreateStockMovementPayload, VariantLookup } from '~/types/admin-inventory'
import { stockMovementSchema } from '~/utils/validation/schemas'

const open = defineModel<boolean>({ required: true })
const createMutation = useAdminCreateStockMovementMutation()
const { data: warehouses } = useAdminActiveWarehousesQuery()

const variantSearch = ref('')
const variantResults = ref<VariantLookup[]>([])
const selectedVariant = ref<VariantLookup | null>(null)
const isSearching = ref(false)

const warehouseOptions = computed(() =>
  (warehouses.value ?? []).map((warehouse) => ({
    label: warehouse.name,
    value: warehouse.id,
  })),
)

const targetWarehouseOptions = computed(() =>
  (warehouses.value ?? [])
    .filter((warehouse) => warehouse.id !== warehouseId.value)
    .map((warehouse) => ({ label: warehouse.name, value: warehouse.id })),
)

const movementTypeOptions = [
  { label: 'Entrada', value: 'RECEIPT' },
  { label: 'Salida', value: 'SHIPMENT' },
  { label: 'Ajuste (+/-)', value: 'ADJUSTMENT' },
  { label: 'Transferencia', value: 'TRANSFER' },
]

const { resetForm, setValues, createSubmitHandler } = useApiForm({
  schema: stockMovementSchema,
  initialValues: {
    warehouseId: '',
    variantId: '',
    type: 'RECEIPT' as const,
    quantity: 1,
    note: '',
    targetWarehouseId: '',
  },
})

const { value: warehouseId } = useField<string>('warehouseId')
const { value: movementType } = useField<'RECEIPT' | 'SHIPMENT' | 'ADJUSTMENT' | 'TRANSFER'>('type')

const isSubmitting = computed(() => createMutation.isPending.value)
const isTransfer = computed(() => movementType.value === 'TRANSFER')

let searchTimer: ReturnType<typeof setTimeout> | undefined

watch(variantSearch, (term) => {
  clearTimeout(searchTimer)
  if (term.trim().length < 2) {
    variantResults.value = []
    return
  }

  searchTimer = setTimeout(async () => {
    isSearching.value = true
    try {
      variantResults.value = await lookupAdminVariants(term.trim())
    } catch {
      variantResults.value = []
    } finally {
      isSearching.value = false
    }
  }, 300)
})

function selectVariant(variant: VariantLookup) {
  selectedVariant.value = variant
  setValues({ variantId: variant.id })
  variantSearch.value = `${variant.sku} — ${variant.productName}`
  variantResults.value = []
}

watch(open, (value) => {
  if (value) {
    const defaultWarehouse = warehouses.value?.find((item) => item.isDefault)
    if (defaultWarehouse) {
      setValues({ warehouseId: defaultWarehouse.id })
    }
  } else {
    resetForm()
    variantSearch.value = ''
    selectedVariant.value = null
    variantResults.value = []
  }
})

const onSubmit = createSubmitHandler(
  async (values) => {
    const payload: CreateStockMovementPayload = {
      warehouseId: values.warehouseId,
      variantId: values.variantId,
      type: values.type,
      quantity: values.quantity,
      note: values.note,
      targetWarehouseId:
        values.type === 'TRANSFER' ? values.targetWarehouseId || undefined : undefined,
    }
    await createMutation.mutateAsync(payload)
    open.value = false
  },
  { successMessage: 'Movimiento registrado correctamente' },
)
</script>

<template>
  <UiModal
    v-model="open"
    title="Registrar movimiento"
    description="Entrada, salida, ajuste o transferencia de stock."
    size="lg"
  >
    <form class="space-y-5" @submit.prevent="onSubmit">
      <AdminFormSection
        title="Producto"
        description="Busca la variante por SKU o nombre de producto."
        icon="lucide:scan-barcode"
      >
        <div class="space-y-3">
          <UiInput
            v-model="variantSearch"
            label="Buscar variante"
            placeholder="Escribe al menos 2 caracteres…"
            autocomplete="off"
          />
          <div v-if="isSearching" class="text-admin-muted flex items-center gap-2 text-sm">
            <UiSpinner size="sm" />
            Buscando variantes…
          </div>
          <div
            v-else-if="variantResults.length"
            class="border-admin-line max-h-40 overflow-auto rounded-lg border"
          >
            <button
              v-for="variant in variantResults"
              :key="variant.id"
              type="button"
              class="hover:bg-admin-surface block w-full px-3 py-2 text-left text-sm"
              @click="selectVariant(variant)"
            >
              <span class="font-medium">{{ variant.sku }}</span>
              <span class="text-admin-muted"> — {{ variant.productName }}</span>
            </button>
          </div>
          <p v-if="selectedVariant" class="text-sm">
            Seleccionado: <strong>{{ selectedVariant.sku }}</strong>
          </p>
        </div>
      </AdminFormSection>

      <AdminFormSection
        title="Movimiento"
        description="Tipo, almacén y cantidad."
        icon="lucide:arrow-left-right"
      >
        <div class="grid gap-4 sm:grid-cols-2">
          <UiFormSelect
            name="type"
            label="Tipo"
            :options="movementTypeOptions"
            required
          />
          <UiFormSelect
            name="warehouseId"
            label="Almacén"
            :options="warehouseOptions"
            required
          />
          <UiFormField
            name="quantity"
            label="Cantidad"
            type="number"
            step="1"
            required
            :hint="
              isTransfer
                ? 'Cantidad a transferir al destino.'
                : movementType === 'ADJUSTMENT'
                  ? 'Positivo suma, negativo resta.'
                  : 'Cantidad del movimiento.'
            "
          />
          <UiFormSelect
            v-if="isTransfer"
            name="targetWarehouseId"
            label="Almacén destino"
            :options="targetWarehouseOptions"
            required
          />
          <UiFormField
            name="note"
            label="Nota"
            class="sm:col-span-2"
            autocomplete="off"
            hint="Opcional. Motivo o referencia."
          />
        </div>
      </AdminFormSection>
    </form>

    <template #footer>
      <AdminModalFooter
        submit-label="Registrar"
        :loading="isSubmitting"
        @cancel="open = false"
        @submit="onSubmit"
      />
    </template>
  </UiModal>
</template>
