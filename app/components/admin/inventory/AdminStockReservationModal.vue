<script setup lang="ts">
import { useField } from 'vee-validate'
import { lookupAdminVariants } from '~/api/admin-inventory.api'
import type { CreateStockReservationPayload, VariantLookup } from '~/types/admin-inventory'
import { stockReservationSchema } from '~/utils/validation/schemas'

const props = defineProps<{
  initialVariant?: VariantLookup | null
  lockVariant?: boolean
}>()

const open = defineModel<boolean>({ required: true })
const createMutation = useAdminCreateStockReservationMutation()
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

const { resetForm, setValues, createSubmitHandler } = useApiForm({
  schema: stockReservationSchema,
  initialValues: {
    warehouseId: '',
    variantId: '',
    quantity: 1,
    reference: '',
    note: '',
  },
})

const isSubmitting = computed(() => createMutation.isPending.value)

let searchTimer: ReturnType<typeof setTimeout> | undefined
const suppressVariantSearch = ref(false)

watch(variantSearch, (term) => {
  if (props.lockVariant || suppressVariantSearch.value) return
  if (selectedVariant.value) return

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

function bindVariant(variant: VariantLookup) {
  suppressVariantSearch.value = true
  clearTimeout(searchTimer)
  selectedVariant.value = variant
  setValues({ variantId: variant.id })
  variantResults.value = []
  isSearching.value = false
  variantSearch.value = ''
  nextTick(() => {
    suppressVariantSearch.value = false
  })
}

function selectVariant(variant: VariantLookup) {
  bindVariant(variant)
}

function applyInitialVariant(variant: VariantLookup) {
  bindVariant(variant)
}

function clearSelectedVariant() {
  suppressVariantSearch.value = true
  selectedVariant.value = null
  setValues({ variantId: '' })
  variantSearch.value = ''
  variantResults.value = []
  nextTick(() => {
    suppressVariantSearch.value = false
  })
}

watch(open, (value) => {
  if (value) {
    const defaultWarehouse = warehouses.value?.find((item) => item.isDefault)
    if (defaultWarehouse) {
      setValues({ warehouseId: defaultWarehouse.id })
    }
    if (props.initialVariant) {
      applyInitialVariant(props.initialVariant)
    }
  } else {
    resetForm()
    clearTimeout(searchTimer)
    variantSearch.value = ''
    selectedVariant.value = null
    variantResults.value = []
    isSearching.value = false
  }
})

watch(
  () => props.initialVariant,
  (variant) => {
    if (open.value && variant) {
      applyInitialVariant(variant)
    }
  },
)

const onSubmit = createSubmitHandler(
  async (values) => {
    const payload: CreateStockReservationPayload = {
      warehouseId: values.warehouseId,
      variantId: values.variantId,
      quantity: values.quantity,
      reference: values.reference,
      note: values.note,
    }
    await createMutation.mutateAsync(payload)
    open.value = false
  },
  { successMessage: 'Stock reservado correctamente' },
)
</script>

<template>
  <UiModal
    v-model="open"
    title="Reservar stock"
    description="Bloquea unidades disponibles para un pedido o referencia."
    size="lg"
  >
    <form class="space-y-5" @submit.prevent="onSubmit">
      <AdminFormSection
        title="Producto"
        description="Variante a reservar."
        icon="lucide:scan-barcode"
      >
        <div class="space-y-3">
          <UiInput
            v-if="!lockVariant && !selectedVariant"
            v-model="variantSearch"
            label="Buscar variante"
            placeholder="Escribe al menos 2 caracteres…"
            autocomplete="off"
          />
          <div
            v-else-if="!lockVariant && selectedVariant"
            class="flex items-center justify-between gap-2 rounded-lg border border-admin-line px-3 py-2 text-sm"
          >
            <p>
              <strong>{{ selectedVariant.sku }}</strong>
              <span class="text-admin-muted"> — {{ selectedVariant.productName }}</span>
            </p>
            <UiButton size="sm" variant="ghost" type="button" @click="clearSelectedVariant">
              Cambiar
            </UiButton>
          </div>
          <p v-else-if="lockVariant && selectedVariant" class="text-sm">
            Variante: <strong>{{ selectedVariant.sku }}</strong>
            <span class="text-admin-muted"> — {{ selectedVariant.productName }}</span>
          </p>
          <div v-if="isSearching" class="text-admin-muted flex items-center gap-2 text-sm">
            <UiSpinner size="sm" />
            Buscando variantes…
          </div>
          <div
            v-else-if="!lockVariant && variantResults.length"
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
        </div>
      </AdminFormSection>

      <AdminFormSection
        title="Reserva"
        description="Almacén, cantidad y referencia."
        icon="lucide:bookmark"
      >
        <div class="grid gap-4 sm:grid-cols-2">
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
            min="1"
            step="1"
            required
          />
          <UiFormField
            name="reference"
            label="Referencia"
            autocomplete="off"
            hint="Opcional. Nº pedido, cotización, etc."
          />
          <UiFormField
            name="note"
            label="Nota"
            autocomplete="off"
            hint="Opcional."
          />
        </div>
      </AdminFormSection>
    </form>

    <template #footer>
      <AdminModalFooter
        submit-label="Reservar"
        :loading="isSubmitting"
        @cancel="open = false"
        @submit="onSubmit"
      />
    </template>
  </UiModal>
</template>
