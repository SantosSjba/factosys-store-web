<script setup lang="ts">
import { createCustomerSchema } from '~/utils/validation/schemas'

const open = defineModel<boolean>({ required: true })

const createMutation = useAdminCreateCustomerMutation()

const { resetForm, createSubmitHandler, withMutationPending } = useApiForm({
  schema: createCustomerSchema,
  initialValues: {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
  },
})

const isSubmitting = withMutationPending(createMutation)

const onSubmit = createSubmitHandler(
  async (values) => {
    await createMutation.mutateAsync(values)
    open.value = false
  },
  { successMessage: 'Cliente creado correctamente' },
)

watch(open, (value) => {
  if (!value) resetForm()
})
</script>

<template>
  <UiModal
    v-model="open"
    title="Nuevo cliente"
    description="Crea una cuenta de cliente activa en la tienda. El usuario podrá iniciar sesión de inmediato."
    size="lg"
  >
    <form @submit.prevent="onSubmit">
      <AdminPersonFields />
    </form>

    <template #footer>
      <AdminModalFooter
        submit-label="Crear cliente"
        :loading="isSubmitting"
        @cancel="open = false"
        @submit="onSubmit"
      />
    </template>
  </UiModal>
</template>
