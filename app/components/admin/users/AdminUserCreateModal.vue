<script setup lang="ts">
import type { StaffRole } from '~/types/admin-users'
import { createStaffUserSchema } from '~/utils/validation/schemas'

const open = defineModel<boolean>({ required: true })

const props = defineProps<{
  roles: StaffRole[]
}>()

const createMutation = useAdminCreateUserMutation()

const { resetForm, createSubmitHandler, withMutationPending } = useApiForm({
  schema: createStaffUserSchema,
  initialValues: {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    roleSlugs: [] as string[],
  },
})

const isSubmitting = withMutationPending(createMutation)

const roleOptions = computed(() => mapRoleOptions(props.roles))

const onSubmit = createSubmitHandler(
  async (values) => {
    await createMutation.mutateAsync(values)
    open.value = false
  },
  { successMessage: 'Usuario creado correctamente' },
)

watch(open, (value) => {
  if (!value) resetForm()
})
</script>

<template>
  <UiModal
    v-model="open"
    title="Nuevo usuario staff"
    description="Registra personal con acceso al panel administrativo."
    size="lg"
  >
    <form class="space-y-5" @submit.prevent="onSubmit">
      <AdminPersonFields />

      <AdminFormSection
        title="Roles y permisos"
        description="Define el alcance de acceso en el panel admin."
        icon="lucide:shield"
      >
        <UiFormCheckboxGroup
          name="roleSlugs"
          label="Roles asignados"
          :options="roleOptions"
          required
          hint="Los permisos efectivos serán la unión de todos los roles seleccionados."
        />
      </AdminFormSection>
    </form>

    <template #footer>
      <AdminModalFooter
        submit-label="Crear usuario"
        :loading="isSubmitting"
        @cancel="open = false"
        @submit="onSubmit"
      />
    </template>
  </UiModal>
</template>
