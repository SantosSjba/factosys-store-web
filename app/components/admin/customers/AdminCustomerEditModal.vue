<script setup lang="ts">
import { useField } from 'vee-validate'
import type { StoreCustomer, UpdateCustomerPayload } from '~/types/admin-customers'
import { updateCustomerSchema } from '~/utils/validation/schemas'

const open = defineModel<boolean>({ required: true })

const props = defineProps<{
  customer: StoreCustomer | null
}>()

const updateMutation = useAdminUpdateCustomerMutation()

const { resetForm, setValues, createSubmitHandler, withMutationPending } = useApiForm({
  schema: updateCustomerSchema,
  initialValues: {
    firstName: '',
    lastName: '',
    phone: '',
    status: 'ACTIVE' as StoreCustomer['status'],
    password: '',
    clearEmailVerification: false,
  },
})

const { value: clearEmailVerification, errorMessage: clearEmailVerificationError } =
  useField<boolean>('clearEmailVerification')

const isSubmitting = withMutationPending(updateMutation)

const isLocalAuth = computed(
  () => props.customer?.authProvider === 'LOCAL',
)

const isEmailVerified = computed(
  () => Boolean(props.customer?.emailVerifiedAt),
)

const statusOptions = [
  { label: 'Pendiente de verificación', value: 'PENDING_VERIFICATION' },
  { label: 'Activo', value: 'ACTIVE' },
  { label: 'Suspendido', value: 'SUSPENDED' },
]

function loadCustomer(customer: StoreCustomer) {
  setValues({
    firstName: customer.firstName ?? '',
    lastName: customer.lastName ?? '',
    phone: customer.phone ?? '',
    status: customer.status,
    password: '',
    clearEmailVerification: false,
  })
}

watch(
  () => props.customer,
  (customer) => {
    if (customer) loadCustomer(customer)
  },
  { immediate: true },
)

watch(open, (value) => {
  if (value && props.customer) loadCustomer(props.customer)
  if (!value) resetForm()
})

const onSubmit = createSubmitHandler(
  async (values) => {
    if (!props.customer) return

    const payload: UpdateCustomerPayload = {
      firstName: values.firstName,
      lastName: values.lastName,
      phone: values.phone,
      status: values.status,
    }

    if (values.password && isLocalAuth.value) {
      payload.password = values.password
    }

    if (values.clearEmailVerification) {
      payload.clearEmailVerification = true
    }

    await updateMutation.mutateAsync({
      id: props.customer.id,
      payload,
    })
    open.value = false
  },
  { successMessage: 'Cliente actualizado correctamente' },
)
</script>

<template>
  <UiModal
    v-model="open"
    title="Editar cliente"
    :description="customer?.email"
    size="lg"
  >
    <form v-if="customer" class="space-y-4" @submit.prevent="onSubmit">
      <div class="grid gap-4 sm:grid-cols-2">
        <UiFormField name="firstName" label="Nombre" autocomplete="off" />
        <UiFormField name="lastName" label="Apellido" autocomplete="off" />
        <div class="sm:col-span-2">
          <UiFormField
            name="phone"
            label="Teléfono"
            type="tel"
            autocomplete="off"
          />
        </div>
        <UiFormSelect name="status" label="Estado" :options="statusOptions" required />
        <div v-if="isEmailVerified" class="sm:col-span-2">
          <UiCheckbox
            :model-value="clearEmailVerification ?? false"
            label="Quitar verificación de correo"
            hint="El cliente deberá verificar su correo de nuevo para acceder. Se cerrarán sus sesiones activas."
            :error="clearEmailVerificationError"
            @update:model-value="clearEmailVerification = $event"
          />
        </div>
        <UiFormField
          v-if="isLocalAuth"
          name="password"
          label="Nueva contraseña"
          type="password"
          autocomplete="new-password"
          hint="Opcional. Mínimo 8 caracteres."
        />
      </div>

      <UiAlert v-if="!isLocalAuth" variant="info" class="text-sm">
        Esta cuenta usa acceso con Google; no se puede cambiar la contraseña local.
      </UiAlert>
    </form>

    <template #footer>
      <AdminModalFooter
        submit-label="Guardar cambios"
        :loading="isSubmitting"
        @cancel="open = false"
        @submit="onSubmit"
      />
    </template>
  </UiModal>
</template>
