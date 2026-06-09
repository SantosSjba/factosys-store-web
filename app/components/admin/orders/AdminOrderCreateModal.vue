<script setup lang="ts">
import { lookupAdminCustomers } from '~/api/admin-customers.api'
import { lookupAdminVariants } from '~/api/admin-inventory.api'
import type { CreateOrderPayload, OrderDeliveryMethod } from '~/types/admin-orders'
import type { StoreCustomer } from '~/types/admin-customers'
import type { VariantLookup } from '~/types/admin-inventory'

const open = defineModel<boolean>({ required: true })

const emit = defineEmits<{
  created: [orderId: string]
}>()

const createMutation = useAdminCreateOrderMutation()
const { data: warehouses } = useAdminActiveWarehousesQuery()
const { data: storeSettings } = useAdminStoreSettingsQuery()

type LineDraft = {
  key: string
  variant: VariantLookup | null
  search: string
  results: VariantLookup[]
  searching: boolean
  quantity: number
}

const customerMode = ref<'registered' | 'guest'>('guest')
const selectedCustomer = ref<StoreCustomer | null>(null)
const customerSearch = ref('')
const customerResults = ref<StoreCustomer[]>([])
const isCustomerSearching = ref(false)
const guestEmail = ref('')
const guestFirstName = ref('')
const guestLastName = ref('')
const guestPhone = ref('')
const warehouseId = ref('')
const deliveryMethod = ref<OrderDeliveryMethod>('SHIPPING')
const paymentStatus = ref<'PENDING' | 'PAID'>('PENDING')
const customerNotes = ref('')
const internalNotes = ref('')
const shippingAddressLine1 = ref('')
const shippingDistrict = ref('')
const shippingProvince = ref('')
const shippingDepartment = ref('')
const shippingAmount = ref<number | ''>('')
const discountAmount = ref<number | ''>('')
const couponCode = ref('')

const lines = ref<LineDraft[]>([createLine()])
const formError = ref('')

const warehouseOptions = computed(() =>
  (warehouses.value ?? []).map((warehouse) => ({
    label: warehouse.name,
    value: warehouse.id,
  })),
)

const isSubmitting = computed(() => createMutation.isPending.value)

function createLine(): LineDraft {
  return {
    key: crypto.randomUUID(),
    variant: null,
    search: '',
    results: [],
    searching: false,
    quantity: 1,
  }
}

function addLine() {
  lines.value.push(createLine())
}

function removeLine(key: string) {
  if (lines.value.length === 1) return
  lines.value = lines.value.filter((line) => line.key !== key)
}

const searchTimers = new Map<string, ReturnType<typeof setTimeout>>()
let customerSearchTimer: ReturnType<typeof setTimeout> | undefined

function formatCustomerLabel(customer: StoreCustomer) {
  const name = [customer.firstName, customer.lastName].filter(Boolean).join(' ')
  return name ? `${name} · ${customer.email}` : customer.email
}

function scheduleCustomerSearch() {
  if (selectedCustomer.value) return
  clearTimeout(customerSearchTimer)
  if (customerSearch.value.trim().length < 2) {
    customerResults.value = []
    isCustomerSearching.value = false
    return
  }
  customerSearchTimer = setTimeout(async () => {
    isCustomerSearching.value = true
    try {
      customerResults.value = await lookupAdminCustomers(customerSearch.value)
    } catch {
      customerResults.value = []
    } finally {
      isCustomerSearching.value = false
    }
  }, 300)
}

function selectCustomer(customer: StoreCustomer) {
  selectedCustomer.value = customer
  customerSearch.value = ''
  customerResults.value = []
}

function clearCustomer() {
  selectedCustomer.value = null
  customerSearch.value = ''
  customerResults.value = []
  isCustomerSearching.value = false
}

function scheduleVariantSearch(line: LineDraft) {
  if (line.variant) return
  clearTimeout(searchTimers.get(line.key))
  if (line.search.trim().length < 2) {
    line.results = []
    line.searching = false
    return
  }
  searchTimers.set(
    line.key,
    setTimeout(async () => {
      line.searching = true
      try {
        line.results = await lookupAdminVariants(line.search.trim())
      } catch {
        line.results = []
      } finally {
        line.searching = false
      }
    }, 300),
  )
}

function selectVariant(line: LineDraft, variant: VariantLookup) {
  line.variant = variant
  line.search = ''
  line.results = []
}

function clearVariant(line: LineDraft) {
  line.variant = null
  line.search = ''
  line.results = []
}

watch(open, (value) => {
  if (value) {
    const defaultWarehouse = warehouses.value?.find((item) => item.isDefault)
    warehouseId.value = defaultWarehouse?.id ?? ''
    deliveryMethod.value = 'SHIPPING'
    customerMode.value = 'guest'
    clearCustomer()
    guestEmail.value = ''
    guestFirstName.value = ''
    guestLastName.value = ''
    guestPhone.value = ''
    paymentStatus.value = 'PENDING'
    customerNotes.value = ''
    internalNotes.value = ''
    shippingAddressLine1.value = ''
    shippingDistrict.value = ''
    shippingProvince.value = ''
    shippingDepartment.value = ''
    shippingAmount.value = storeSettings.value?.flatShippingFee
      ? Number(storeSettings.value.flatShippingFee)
      : ''
    discountAmount.value = ''
    couponCode.value = ''
    lines.value = [createLine()]
    formError.value = ''
  } else {
    for (const timer of searchTimers.values()) clearTimeout(timer)
    searchTimers.clear()
    clearTimeout(customerSearchTimer)
    customerResults.value = []
    isCustomerSearching.value = false
  }
})

watch(customerMode, () => {
  clearCustomer()
})

watch(deliveryMethod, (value) => {
  if (value === 'PICKUP') {
    shippingAmount.value = 0
    return
  }
  const flatFee = storeSettings.value?.flatShippingFee
  shippingAmount.value = flatFee ? Number(flatFee) : ''
})

async function onSubmit() {
  formError.value = ''
  const preparedLines = lines.value.filter((line) => line.variant && line.quantity > 0)

  if (!preparedLines.length) {
    formError.value = 'Agrega al menos un producto al pedido.'
    return
  }

  if (customerMode.value === 'guest' && !guestEmail.value.trim()) {
    formError.value = 'Ingresa el correo del cliente invitado.'
    return
  }

  if (customerMode.value === 'registered' && !selectedCustomer.value) {
    formError.value = 'Selecciona un cliente registrado.'
    return
  }

  if (
    deliveryMethod.value === 'SHIPPING' &&
    !shippingAddressLine1.value.trim()
  ) {
    formError.value = 'Ingresa la dirección de envío.'
    return
  }

  const payload: CreateOrderPayload = {
    warehouseId: warehouseId.value || undefined,
    paymentStatus: paymentStatus.value,
    deliveryMethod: deliveryMethod.value,
    source: 'ADMIN',
    customerNotes: customerNotes.value || undefined,
    internalNotes: internalNotes.value || undefined,
    items: preparedLines.map((line) => ({
      variantId: line.variant!.id,
      quantity: line.quantity,
    })),
    ...(customerMode.value === 'registered'
      ? { customerId: selectedCustomer.value!.id }
      : {
          guestEmail: guestEmail.value.trim(),
          guestFirstName: guestFirstName.value.trim() || undefined,
          guestLastName: guestLastName.value.trim() || undefined,
          guestPhone: guestPhone.value.trim() || undefined,
        }),
    ...(deliveryMethod.value === 'SHIPPING'
      ? {
          addresses: [
            {
              type: 'SHIPPING' as const,
              firstName:
                customerMode.value === 'registered'
                  ? selectedCustomer.value?.firstName?.trim() || undefined
                  : guestFirstName.value.trim() || undefined,
              lastName:
                customerMode.value === 'registered'
                  ? selectedCustomer.value?.lastName?.trim() || undefined
                  : guestLastName.value.trim() || undefined,
              email:
                customerMode.value === 'registered'
                  ? selectedCustomer.value?.email
                  : guestEmail.value.trim() || undefined,
              phone:
                customerMode.value === 'registered'
                  ? selectedCustomer.value?.phone?.trim() || undefined
                  : guestPhone.value.trim() || undefined,
              addressLine1: shippingAddressLine1.value.trim(),
              district: shippingDistrict.value.trim() || undefined,
              province: shippingProvince.value.trim() || undefined,
              department: shippingDepartment.value.trim() || undefined,
              country: 'PE',
            },
          ],
          shippingAmount:
            shippingAmount.value === '' ? undefined : Number(shippingAmount.value),
          discountAmount:
            discountAmount.value === '' ? undefined : Number(discountAmount.value),
          couponCode: couponCode.value.trim() || undefined,
        }
      : {
          shippingAmount: 0,
          discountAmount:
            discountAmount.value === '' ? undefined : Number(discountAmount.value),
          couponCode: couponCode.value.trim() || undefined,
        }),
  }

  try {
    const order = await createMutation.mutateAsync(payload)
    emit('created', order.id)
    open.value = false
  } catch (error) {
    formError.value = useApiErrorMessage(error)
  }
}
</script>

<template>
  <UiModal
    v-model="open"
    title="Nuevo pedido"
    description="Crear pedido manual desde el panel admin."
    size="xl"
  >
    <form class="space-y-5" @submit.prevent="onSubmit">
      <UiAlert v-if="formError" variant="error">{{ formError }}</UiAlert>

      <AdminFormSection title="Cliente" icon="lucide:user">
        <div class="mb-3 flex gap-2">
          <UiButton
            size="sm"
            :variant="customerMode === 'guest' ? 'primary' : 'ghost'"
            type="button"
            @click="customerMode = 'guest'"
          >
            Invitado
          </UiButton>
          <UiButton
            size="sm"
            :variant="customerMode === 'registered' ? 'primary' : 'ghost'"
            type="button"
            @click="customerMode = 'registered'"
          >
            Registrado
          </UiButton>
        </div>

        <div v-if="customerMode === 'guest'" class="grid gap-3 sm:grid-cols-2">
          <UiInput v-model="guestEmail" label="Correo" type="email" required />
          <UiInput v-model="guestPhone" label="Teléfono" />
          <UiInput v-model="guestFirstName" label="Nombre" />
          <UiInput v-model="guestLastName" label="Apellido" />
        </div>
        <div v-else>
          <div v-if="selectedCustomer" class="mb-3 rounded-md bg-admin-muted/40 px-3 py-2 text-sm">
            <p class="font-medium">{{ formatCustomerLabel(selectedCustomer) }}</p>
            <p v-if="selectedCustomer.phone" class="text-admin-muted text-xs">
              {{ selectedCustomer.phone }}
            </p>
            <button
              type="button"
              class="text-brand-accent mt-1 text-xs hover:underline"
              @click="clearCustomer"
            >
              Cambiar cliente
            </button>
          </div>

          <div v-else class="space-y-2">
            <UiInput
              v-model="customerSearch"
              label="Buscar cliente"
              placeholder="Nombre, correo o teléfono…"
              autocomplete="off"
              @update:model-value="scheduleCustomerSearch"
            />
            <div
              v-if="isCustomerSearching"
              class="text-admin-muted flex items-center gap-2 text-sm"
            >
              <UiSpinner size="sm" />
              Buscando clientes…
            </div>
            <div
              v-else-if="customerResults.length"
              class="border-admin-line max-h-40 overflow-auto rounded-lg border"
            >
              <button
                v-for="customer in customerResults"
                :key="customer.id"
                type="button"
                class="hover:bg-admin-surface block w-full px-3 py-2 text-left text-sm"
                @click="selectCustomer(customer)"
              >
                <span class="font-medium">{{ formatCustomerLabel(customer) }}</span>
                <span v-if="customer.phone" class="text-admin-muted block text-xs">
                  {{ customer.phone }}
                </span>
              </button>
            </div>
            <p
              v-else-if="customerSearch.trim().length >= 2"
              class="text-admin-muted text-sm"
            >
              Sin coincidencias.
            </p>
          </div>
        </div>
      </AdminFormSection>

      <AdminFormSection title="Productos" icon="lucide:package">
        <div class="space-y-4">
          <div
            v-for="(line, index) in lines"
            :key="line.key"
            class="border-admin-line rounded-lg border p-3"
          >
            <div class="mb-2 flex items-center justify-between">
              <p class="text-sm font-medium">Ítem {{ index + 1 }}</p>
              <UiIconButton
                v-if="lines.length > 1"
                icon="lucide:trash-2"
                ariaLabel="Quitar ítem"
                @click="removeLine(line.key)"
              />
            </div>

            <div v-if="line.variant" class="mb-3 rounded-md bg-admin-muted/40 px-3 py-2 text-sm">
              <p class="font-medium">{{ line.variant.productName }}</p>
              <p class="text-admin-muted text-xs">
                {{ line.variant.sku }}
                <span v-if="line.variant.name"> · {{ line.variant.name }}</span>
              </p>
              <button
                type="button"
                class="text-brand-accent mt-1 text-xs hover:underline"
                @click="clearVariant(line)"
              >
                Cambiar variante
              </button>
            </div>

            <div v-else class="mb-3 space-y-2">
              <UiInput
                v-model="line.search"
                label="Buscar variante"
                placeholder="SKU o nombre de producto…"
                autocomplete="off"
                @update:model-value="scheduleVariantSearch(line)"
              />
              <div
                v-if="line.searching"
                class="text-admin-muted flex items-center gap-2 text-sm"
              >
                <UiSpinner size="sm" />
                Buscando variantes…
              </div>
              <div
                v-else-if="line.results.length"
                class="border-admin-line max-h-40 overflow-auto rounded-lg border"
              >
                <button
                  v-for="result in line.results"
                  :key="result.id"
                  type="button"
                  class="hover:bg-admin-surface block w-full px-3 py-2 text-left text-sm"
                  @click="selectVariant(line, result)"
                >
                  <span class="font-medium">{{ result.productName }}</span>
                  <span class="text-admin-muted block text-xs">
                    {{ result.sku }}<span v-if="result.name"> · {{ result.name }}</span>
                  </span>
                </button>
              </div>
              <p
                v-else-if="line.search.trim().length >= 2"
                class="text-admin-muted text-sm"
              >
                Sin coincidencias.
              </p>
            </div>

            <UiInput
              v-model.number="line.quantity"
              label="Cantidad"
              type="number"
              min="1"
            />
          </div>

          <UiButton type="button" variant="ghost" size="sm" @click="addLine">
            <UiIcon name="lucide:plus" :size="16" class="mr-2" />
            Agregar ítem
          </UiButton>
        </div>
      </AdminFormSection>

      <AdminFormSection title="Operación" icon="lucide:settings-2">
        <div class="grid gap-3 sm:grid-cols-2">
          <UiSelect
            v-model="warehouseId"
            label="Almacén"
            :options="warehouseOptions"
            placeholder="Almacén predeterminado"
          />
          <UiSelect
            v-model="paymentStatus"
            label="Estado de pago inicial"
            :options="[
              { label: 'Pendiente', value: 'PENDING' },
              { label: 'Pagado', value: 'PAID' },
            ]"
          />
        </div>
      </AdminFormSection>

      <AdminFormSection title="Entrega" icon="lucide:truck">
        <div class="mb-3 flex gap-2">
          <UiButton
            size="sm"
            :variant="deliveryMethod === 'SHIPPING' ? 'primary' : 'ghost'"
            type="button"
            @click="deliveryMethod = 'SHIPPING'"
          >
            Envío a domicilio
          </UiButton>
          <UiButton
            size="sm"
            :variant="deliveryMethod === 'PICKUP' ? 'primary' : 'ghost'"
            type="button"
            @click="deliveryMethod = 'PICKUP'"
          >
            Recojo en tienda
          </UiButton>
        </div>

        <p
          v-if="deliveryMethod === 'PICKUP'"
          class="text-admin-muted rounded-md bg-admin-muted/30 px-3 py-2 text-sm"
        >
          El cliente recogerá el pedido en el almacén seleccionado. No se requiere dirección de envío.
        </p>

        <div v-else class="grid gap-3 sm:grid-cols-2">
          <UiInput
            v-model="shippingAddressLine1"
            label="Dirección"
            class="sm:col-span-2"
            required
          />
          <UiInput v-model="shippingDistrict" label="Distrito" />
          <UiInput v-model="shippingProvince" label="Provincia" />
          <UiInput v-model="shippingDepartment" label="Departamento" />
          <UiInput
            v-model.number="shippingAmount"
            label="Costo de envío"
            type="number"
            min="0"
            step="0.01"
          />
        </div>
      </AdminFormSection>

      <AdminFormSection title="Descuentos" icon="lucide:ticket">
        <div class="grid gap-3 sm:grid-cols-2">
          <UiInput
            v-model="couponCode"
            label="Código de cupón"
            placeholder="Ej. VERANO20"
            class="font-mono uppercase"
            hint="Si usas cupón, reemplaza el descuento manual"
          />
          <UiInput
            v-model.number="discountAmount"
            label="Descuento manual"
            type="number"
            min="0"
            step="0.01"
          />
        </div>
      </AdminFormSection>

      <AdminFormSection title="Notas" icon="lucide:sticky-note">
        <div class="grid gap-3">
          <UiInput v-model="customerNotes" label="Notas del cliente" />
          <UiInput v-model="internalNotes" label="Notas internas" />
        </div>
      </AdminFormSection>
    </form>

    <template #footer>
      <UiButton variant="ghost" @click="open = false">Cancelar</UiButton>
      <UiButton :loading="isSubmitting" @click="onSubmit">
        Crear pedido
      </UiButton>
    </template>
  </UiModal>
</template>
