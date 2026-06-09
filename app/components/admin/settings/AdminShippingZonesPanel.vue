<script setup lang="ts">
import type { ShippingZone } from '~/types/admin-shipping-zones'

const { can } = useAdminPermissions()
const { data: zones, isPending } = useAdminShippingZonesQuery()
const createMutation = useAdminCreateShippingZoneMutation()
const updateMutation = useAdminUpdateShippingZoneMutation()
const deleteMutation = useAdminDeleteShippingZoneMutation()

const modalOpen = ref(false)
const editing = ref<ShippingZone | null>(null)
const formError = ref('')

const name = ref('')
const department = ref('')
const province = ref('')
const flatFee = ref<number | ''>('')
const freeShippingMinAmount = ref<number | ''>('')
const sortOrder = ref<number | ''>(0)
const isActive = ref(true)

function openCreate() {
  editing.value = null
  name.value = ''
  department.value = ''
  province.value = ''
  flatFee.value = ''
  freeShippingMinAmount.value = ''
  sortOrder.value = 0
  isActive.value = true
  formError.value = ''
  modalOpen.value = true
}

function openEdit(zone: ShippingZone) {
  editing.value = zone
  name.value = zone.name
  department.value = zone.department ?? ''
  province.value = zone.province ?? ''
  flatFee.value = Number(zone.flatFee)
  freeShippingMinAmount.value = zone.freeShippingMinAmount
    ? Number(zone.freeShippingMinAmount)
    : ''
  sortOrder.value = zone.sortOrder
  isActive.value = zone.isActive
  formError.value = ''
  modalOpen.value = true
}

async function onSubmit() {
  formError.value = ''
  if (!name.value.trim() || flatFee.value === '') {
    formError.value = 'Nombre y tarifa son obligatorios.'
    return
  }
  const payload = {
    name: name.value.trim(),
    department: department.value.trim() || undefined,
    province: province.value.trim() || undefined,
    flatFee: Number(flatFee.value),
    freeShippingMinAmount:
      freeShippingMinAmount.value === '' ? undefined : Number(freeShippingMinAmount.value),
    sortOrder: sortOrder.value === '' ? undefined : Number(sortOrder.value),
    isActive: isActive.value,
  }
  try {
    if (editing.value) {
      await updateMutation.mutateAsync({ id: editing.value.id, payload })
      useToast().success('Zona actualizada')
    } else {
      await createMutation.mutateAsync(payload)
      useToast().success('Zona creada')
    }
    modalOpen.value = false
  } catch (error) {
    formError.value = useApiErrorMessage(error)
  }
}

function removeZone(zone: ShippingZone) {
  return runAdminSuspendAction({
    confirm: {
      title: 'Eliminar zona',
      message: `¿Eliminar la zona "${zone.name}"?`,
      confirmLabel: 'Eliminar',
    },
    mutate: () => deleteMutation.mutateAsync(zone.id),
    successMessage: 'Zona eliminada',
  })
}

const isSubmitting = computed(
  () => createMutation.isPending.value || updateMutation.isPending.value,
)
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <p class="text-admin-muted text-sm">
        Tarifas de envío por departamento o provincia.
      </p>
      <UiButton v-if="can('settings.write')" size="sm" @click="openCreate">
        <UiIcon name="lucide:plus" :size="16" class="mr-2" />
        Nueva zona
      </UiButton>
    </div>

    <div v-if="isPending && !zones?.length" class="text-admin-muted flex items-center gap-2 text-sm">
      <UiSpinner size="sm" />
      Cargando zonas…
    </div>

    <div v-else-if="!zones?.length" class="py-6">
      <UiEmptyState
        title="Sin zonas de envío"
        description="Crea zonas para calcular tarifas según ubicación."
      />
    </div>

    <div v-else class="divide-admin-line divide-y rounded-xl border">
      <div
        v-for="zone in zones"
        :key="zone.id"
        class="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
      >
        <div>
          <p class="font-medium">{{ zone.name }}</p>
          <p class="text-admin-muted text-sm">
            {{ [zone.department, zone.province].filter(Boolean).join(' · ') || 'Todas las ubicaciones' }}
          </p>
        </div>
        <div class="flex items-center gap-3">
          <div class="text-right text-sm">
            <p class="font-medium">{{ formatPrice(zone.flatFee) }}</p>
            <p v-if="zone.freeShippingMinAmount" class="text-admin-muted text-xs">
              Gratis desde {{ formatPrice(zone.freeShippingMinAmount) }}
            </p>
          </div>
          <UiBadge :variant="zone.isActive ? 'success' : 'default'">
            {{ zone.isActive ? 'Activa' : 'Inactiva' }}
          </UiBadge>
          <div v-if="can('settings.write')" class="flex gap-1">
            <UiIconButton icon="lucide:pencil" ariaLabel="Editar" @click="openEdit(zone)" />
            <UiIconButton icon="lucide:trash-2" ariaLabel="Eliminar" @click="removeZone(zone)" />
          </div>
        </div>
      </div>
    </div>

    <UiModal
      v-model="modalOpen"
      :title="editing ? 'Editar zona' : 'Nueva zona de envío'"
      size="lg"
    >
      <form class="space-y-4" @submit.prevent="onSubmit">
        <UiAlert v-if="formError" variant="error">{{ formError }}</UiAlert>
        <UiInput v-model="name" label="Nombre" required />
        <div class="grid gap-4 sm:grid-cols-2">
          <UiInput v-model="department" label="Departamento" />
          <UiInput v-model="province" label="Provincia" />
          <UiInput v-model.number="flatFee" label="Tarifa plana" type="number" min="0" step="0.01" required />
          <UiInput
            v-model.number="freeShippingMinAmount"
            label="Envío gratis desde"
            type="number"
            min="0"
            step="0.01"
          />
          <UiInput v-model.number="sortOrder" label="Orden" type="number" min="0" />
          <UiCheckbox v-model="isActive" label="Zona activa" class="self-end" />
        </div>
      </form>
      <template #footer>
        <AdminModalFooter
          :submit-label="editing ? 'Guardar' : 'Crear zona'"
          :loading="isSubmitting"
          @cancel="modalOpen = false"
          @submit="onSubmit"
        />
      </template>
    </UiModal>
  </div>
</template>
