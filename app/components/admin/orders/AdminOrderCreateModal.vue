<script setup lang="ts">
import { lookupAdminVariants } from '~/api/admin-inventory.api'
import type { CreateOrderPayload } from '~/types/admin-orders'
import type { VariantLookup } from '~/types/admin-inventory'

const open = defineModel<boolean>({ required: true })

const emit = defineEmits<{
  created: [orderId: string]
}>()

const createMutation = useAdminCreateOrderMutation()
const { data: warehouses } = useAdminActiveWarehousesQuery()

type LineDraft = {
  key: string
  variant: VariantLookup | null
  search: string
  results: VariantLookup[]
  quantity: number
}

const customerMode = ref<'registered' | 'guest'>('guest')
const customerId = ref('')
const guestEmail = ref('')
const guestFirstName = ref('')
const guestLastName = ref('')
const guestPhone = ref('')
const warehouseId = ref('')
const paymentStatus = ref<'PENDING' | 'PAID'>('PENDING')
const customerNotes = ref('')
const internalNotes = ref('')
const shippingAddressLine1 = ref('')
const shippingDistrict = ref('')
const shippingProvince = ref('')
const shippingDepartment = ref('')

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

function scheduleVariantSearch(line: LineDraft) {
  if (line.variant) return
  clearTimeout(searchTimers.get(line.key))
  if (line.search.trim().length < 2) {
    line.results = []
    return
  }
  searchTimers.set(
    line.key,
    setTimeout(async () => {
      try {
        line.results = await lookupAdminVariants(line.search.trim())
      } catch {
        line.results = []
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
    customerMode.value = 'guest'
    customerId.value = ''
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
    lines.value = [createLine()]
    formError.value = ''
  } else {
    for (const timer of searchTimers.values()) clearTimeout(timer)
    searchTimers.clear()
  }
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

  if (customerMode.value === 'registered' && !customerId.value.trim()) {
    formError.value = 'Ingresa el ID del cliente registrado.'
    return
  }

  const payload: CreateOrderPayload = {
    warehouseId: warehouseId.value || undefined,
    paymentStatus: paymentStatus.value,
    source: 'ADMIN',
    customerNotes: customerNotes.value || undefined,
    internalNotes: internalNotes.value || undefined,
    items: preparedLines.map((line) => ({
      variantId: line.variant!.id,
      quantity: line.quantity,
    })),
    ...(customerMode.value === 'registered'
      ? { customerId: customerId.value.trim() }
      : {
          guestEmail: guestEmail.value.trim(),
          guestFirstName: guestFirstName.value.trim() || undefined,
          guestLastName: guestLastName.value.trim() || undefined,
          guestPhone: guestPhone.value.trim() || undefined,
        }),
    ...(shippingAddressLine1.value.trim()
      ? {
          addresses: [
            {
              type: 'SHIPPING',
              firstName: guestFirstName.value.trim() || undefined,
              lastName: guestLastName.value.trim() || undefined,
              email: guestEmail.value.trim() || undefined,
              phone: guestPhone.value.trim() || undefined,
              addressLine1: shippingAddressLine1.value.trim(),
              district: shippingDistrict.value.trim() || undefined,
              province: shippingProvince.value.trim() || undefined,
              department: shippingDepartment.value.trim() || undefined,
              country: 'PE',
            },
          ],
        }
      : {}),
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
          <UiInput
            v-model="customerId"
            label="ID de cliente"
            hint="UUID del cliente registrado"
            required
          />
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

            <div v-else class="relative mb-3">
              <UiInput
                v-model="line.search"
                label="Buscar variante"
                placeholder="SKU o nombre de producto…"
                @update:model-value="scheduleVariantSearch(line)"
              />
              <div
                v-if="line.results.length"
                class="border-admin-line absolute z-10 mt-1 max-h-40 w-full overflow-auto rounded-md border bg-white shadow-lg dark:bg-neutral-900"
              >
                <button
                  v-for="result in line.results"
                  :key="result.id"
                  type="button"
                  class="hover:bg-admin-muted/50 block w-full px-3 py-2 text-left text-sm"
                  @click="selectVariant(line, result)"
                >
                  <span class="font-medium">{{ result.productName }}</span>
                  <span class="text-admin-muted block text-xs">
                    {{ result.sku }}<span v-if="result.name"> · {{ result.name }}</span>
                  </span>
                </button>
              </div>
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

      <AdminFormSection title="Envío" icon="lucide:truck">
        <div class="grid gap-3 sm:grid-cols-2">
          <UiInput
            v-model="shippingAddressLine1"
            label="Dirección"
            class="sm:col-span-2"
          />
          <UiInput v-model="shippingDistrict" label="Distrito" />
          <UiInput v-model="shippingProvince" label="Provincia" />
          <UiInput v-model="shippingDepartment" label="Departamento" />
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
