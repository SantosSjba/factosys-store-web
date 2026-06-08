<script setup lang="ts">
import type {
  StaffRole,
  StaffUser,
  UpdateStaffUserPayload,
} from '~/types/admin-users'
import { updateStaffUserWithRolesSchema } from '~/utils/validation/schemas'

const open = defineModel<boolean>({ required: true })

const props = defineProps<{
  user: StaffUser | null
  roles: StaffRole[]
}>()

const { can } = useAdminPermissions()
const updateMutation = useAdminUpdateUserMutation()

const { resetForm, setValues, createSubmitHandler, withMutationPending } = useApiForm({
  schema: updateStaffUserWithRolesSchema,
  initialValues: {
    firstName: '',
    lastName: '',
    phone: '',
    status: 'ACTIVE' as StaffUser['status'],
    password: '',
    roleSlugs: [] as string[],
  },
})

const isSubmitting = withMutationPending(updateMutation)

const statusOptions = [
  { label: 'Activo', value: 'ACTIVE' },
  { label: 'Suspendido', value: 'SUSPENDED' },
]

const roleOptions = computed(() => mapRoleOptions(props.roles))

function loadUser(user: StaffUser) {
  setValues({
    firstName: user.firstName ?? '',
    lastName: user.lastName ?? '',
    phone: user.phone ?? '',
    status: user.status,
    password: '',
    roleSlugs: user.roles.map((role) => role.slug),
  })
}

watch(
  () => props.user,
  (user) => {
    if (user) loadUser(user)
  },
  { immediate: true },
)

watch(open, (value) => {
  if (value && props.user) loadUser(props.user)
  if (!value) resetForm()
})

const onSubmit = createSubmitHandler(
  async (values) => {
    if (!props.user) return

    const payload: UpdateStaffUserPayload = {
      firstName: values.firstName,
      lastName: values.lastName,
      phone: values.phone,
      status: values.status,
    }

    if (values.password) {
      payload.password = values.password
    }

    if (can('roles.assign')) {
      payload.roleSlugs = values.roleSlugs
    }

    await updateMutation.mutateAsync({
      id: props.user.id,
      payload,
    })
    open.value = false
  },
  { successMessage: 'Usuario actualizado correctamente' },
)
</script>

<template>
  <UiModal
    v-model="open"
    title="Editar usuario"
    :description="user?.email"
    size="lg"
  >
    <form v-if="user" class="space-y-4" @submit.prevent="onSubmit">
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
        <UiFormField
          name="password"
          label="Nueva contraseña"
          type="password"
          autocomplete="new-password"
          hint="Opcional. Mínimo 8 caracteres."
        />
      </div>

      <UiFormCheckboxGroup
        v-if="can('roles.assign')"
        name="roleSlugs"
        label="Roles asignados"
        :options="roleOptions"
        required
        hint="Los permisos efectivos serán la unión de todos los roles seleccionados."
      />
      <UiAlert v-else variant="info" class="text-sm">
        No tienes permiso para cambiar roles (<code>roles.assign</code>).
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
