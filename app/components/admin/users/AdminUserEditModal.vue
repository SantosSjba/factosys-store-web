<script setup lang="ts">
import type {
  StaffRole,
  StaffUser,
  UpdateStaffUserPayload,
} from '~/types/admin-users'

const open = defineModel<boolean>({ required: true })

const props = defineProps<{
  user: StaffUser | null
  roles: StaffRole[]
}>()

const { can } = useAdminPermissions()
const updateMutation = useAdminUpdateUserMutation()
const isSubmitting = computed(() => updateMutation.isPending.value)

const firstName = ref('')
const lastName = ref('')
const phone = ref('')
const status = ref<StaffUser['status']>('ACTIVE')
const password = ref('')
const roleSlugs = ref<string[]>([])
const errorMessage = ref('')

const statusOptions = [
  { label: 'Activo', value: 'ACTIVE' },
  { label: 'Suspendido', value: 'SUSPENDED' },
]

const roleOptions = computed(() =>
  props.roles.map((role) => ({
    label: role.name,
    value: role.slug,
    hint: role.description ?? undefined,
  })),
)

function loadUser(user: StaffUser) {
  firstName.value = user.firstName ?? ''
  lastName.value = user.lastName ?? ''
  phone.value = user.phone ?? ''
  status.value = user.status
  password.value = ''
  roleSlugs.value = user.roles.map((role) => role.slug)
  errorMessage.value = ''
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
})

async function onSubmit() {
  errorMessage.value = ''
  if (!props.user) return

  if (can('roles.assign') && !roleSlugs.value.length) {
    errorMessage.value = 'Selecciona al menos un rol.'
    return
  }

  try {
    const payload: UpdateStaffUserPayload = {
      firstName: firstName.value || undefined,
      lastName: lastName.value || undefined,
      phone: phone.value || undefined,
      status: status.value,
    }

    if (password.value.trim()) {
      payload.password = password.value
    }

    if (can('roles.assign')) {
      payload.roleSlugs = roleSlugs.value
    }

    await updateMutation.mutateAsync({
      id: props.user.id,
      payload,
    })
    useToast().success('Usuario actualizado correctamente')
    open.value = false
  } catch (error) {
    errorMessage.value = useApiErrorMessage(error)
  }
}
</script>

<template>
  <UiModal
    v-model="open"
    title="Editar usuario"
    :description="user?.email"
    size="lg"
  >
    <form v-if="user" class="space-y-4" @submit.prevent="onSubmit">
      <UiAlert v-if="errorMessage" variant="error">{{ errorMessage }}</UiAlert>

      <div class="grid gap-4 sm:grid-cols-2">
        <UiInput v-model="firstName" label="Nombre" autocomplete="off" />
        <UiInput v-model="lastName" label="Apellido" autocomplete="off" />
        <UiInput
          v-model="phone"
          class="sm:col-span-2"
          label="Teléfono"
          type="tel"
          autocomplete="off"
        />
        <UiSelect
          v-model="status"
          label="Estado"
          :options="statusOptions"
        />
        <UiInput
          v-model="password"
          label="Nueva contraseña"
          type="password"
          autocomplete="new-password"
          hint="Opcional. Mínimo 8 caracteres."
        />
      </div>

      <UiCheckboxGroup
        v-if="can('roles.assign')"
        v-model="roleSlugs"
        label="Roles asignados"
        :options="roleOptions"
        hint="Los permisos efectivos serán la unión de todos los roles seleccionados."
      />
      <UiAlert v-else variant="info" class="text-sm">
        No tienes permiso para cambiar roles (<code>roles.assign</code>).
      </UiAlert>
    </form>

    <template #footer>
      <UiButton variant="ghost" :disabled="isSubmitting" @click="open = false">
        Cancelar
      </UiButton>
      <UiButton :loading="isSubmitting" @click="onSubmit">
        Guardar cambios
      </UiButton>
    </template>
  </UiModal>
</template>
