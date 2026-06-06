<script setup lang="ts">
import { createCustomerSchema } from '~/utils/validation/schemas'

const open = defineModel<boolean>({ required: true })

const createMutation = useAdminCreateCustomerMutation()

const { resetForm, createSubmitHandler, meta } = useApiForm({
  schema: createCustomerSchema,
  initialValues: {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
  },
})

const isSubmitting = computed(
  () => createMutation.isPending.value || meta.value.pending,
)

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
    <form class="space-y-4" @submit.prevent="onSubmit">
      <div class="grid gap-4 sm:grid-cols-2">
        <UiFormField
          name="email"
          label="Correo electrónico"
          type="email"
          autocomplete="off"
        />
        <UiFormField
          name="password"
          label="Contraseña temporal"
          type="password"
          autocomplete="new-password"
          hint="Mínimo 8 caracteres"
        />
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
      </div>
    </form>

    <template #footer>
      <UiButton variant="ghost" :disabled="isSubmitting" @click="open = false">
        Cancelar
      </UiButton>
      <UiButton :loading="isSubmitting" @click="onSubmit">
        Crear cliente
      </UiButton>
    </template>
  </UiModal>
</template>
