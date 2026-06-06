<script setup lang="ts">
import type { StaffRole } from '~/types/admin-users'

const open = defineModel<boolean>({ required: true })

const props = defineProps<{
  roles: StaffRole[]
}>()

const createMutation = useAdminCreateUserMutation()
const isSubmitting = computed(() => createMutation.isPending.value)

const email = ref('')
const password = ref('')
const firstName = ref('')
const lastName = ref('')
const phone = ref('')
const roleSlugs = ref<string[]>([])
const errorMessage = ref('')

const roleOptions = computed(() =>
  props.roles.map((role) => ({
    label: role.name,
    value: role.slug,
    hint: role.description ?? undefined,
  })),
)

function resetForm() {
  email.value = ''
  password.value = ''
  firstName.value = ''
  lastName.value = ''
  phone.value = ''
  roleSlugs.value = []
  errorMessage.value = ''
}

watch(open, (value) => {
  if (!value) resetForm()
})

async function onSubmit() {
  errorMessage.value = ''

  if (!roleSlugs.value.length) {
    errorMessage.value = 'Selecciona al menos un rol.'
    return
  }

  try {
    await createMutation.mutateAsync({
      email: email.value,
      password: password.value,
      firstName: firstName.value || undefined,
      lastName: lastName.value || undefined,
      phone: phone.value || undefined,
      roleSlugs: roleSlugs.value,
    })
    useToast().success('Usuario creado correctamente')
    open.value = false
  } catch (error) {
    errorMessage.value = useApiErrorMessage(error)
  }
}
</script>

<template>
  <UiModal
    v-model="open"
    title="Nuevo usuario staff"
    description="Registra personal con acceso al panel administrativo."
    size="lg"
  >
    <form class="space-y-4" @submit.prevent="onSubmit">
      <UiAlert v-if="errorMessage" variant="error">{{ errorMessage }}</UiAlert>

      <div class="grid gap-4 sm:grid-cols-2">
        <UiInput
          v-model="email"
          label="Correo electrónico"
          type="email"
          autocomplete="off"
          required
        />
        <UiInput
          v-model="password"
          label="Contraseña temporal"
          type="password"
          autocomplete="new-password"
          hint="Mínimo 8 caracteres"
          required
        />
        <UiInput v-model="firstName" label="Nombre" autocomplete="off" />
        <UiInput v-model="lastName" label="Apellido" autocomplete="off" />
        <UiInput
          v-model="phone"
          class="sm:col-span-2"
          label="Teléfono"
          type="tel"
          autocomplete="off"
        />
      </div>

      <UiCheckboxGroup
        v-model="roleSlugs"
        label="Roles asignados"
        :options="roleOptions"
        hint="Los permisos efectivos serán la unión de todos los roles seleccionados."
      />
    </form>

    <template #footer>
      <UiButton variant="ghost" :disabled="isSubmitting" @click="open = false">
        Cancelar
      </UiButton>
      <UiButton :loading="isSubmitting" @click="onSubmit">
        Crear usuario
      </UiButton>
    </template>
  </UiModal>
</template>
