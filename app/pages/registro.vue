<script setup lang="ts">
import { registerSchema } from '~/utils/validation/schemas'

definePageMeta({
  layout: 'auth',
  middleware: 'guest',
})

const registerMutation = useStoreRegisterMutation()

const { createSubmitHandler, meta } = useApiForm({
  schema: registerSchema,
  initialValues: {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  },
})

const isSubmitting = computed(
  () => registerMutation.isPending.value || meta.value.pending,
)

const onSubmit = createSubmitHandler(
  async (values) => {
    const result = await registerMutation.mutateAsync(values)
    useToast().success('Cuenta creada. Revisa tu correo e ingresa el código.')

    await navigateTo({
      path: '/verify-email',
      query: {
        email: result.email,
        ...(result.verificationCode ? { code: result.verificationCode } : {}),
      },
    })
  },
  { invalidMessage: 'Completa los campos obligatorios correctamente.' },
)
</script>

<template>
  <AuthCard
    title="Crear cuenta"
    subtitle="Registro de cliente en la tienda Factosys"
  >
    <form class="space-y-4" @submit.prevent="onSubmit">
      <div class="grid gap-4 sm:grid-cols-2">
        <UiFormField name="firstName" label="Nombre" autocomplete="given-name" />
        <UiFormField name="lastName" label="Apellido" autocomplete="family-name" />
      </div>
      <UiFormField
        name="email"
        label="Correo electrónico"
        type="email"
        autocomplete="email"
      />
      <UiFormField
        name="password"
        label="Contraseña"
        type="password"
        autocomplete="new-password"
        hint="Mínimo 8 caracteres"
      />

      <UiButton type="submit" class="w-full" :loading="isSubmitting">
        Registrarme
      </UiButton>
    </form>

    <p class="mt-6 text-center text-sm text-slate-600">
      ¿Ya tienes cuenta?
      <NuxtLink to="/login" class="text-brand-accent-deep font-semibold hover:underline">
        Inicia sesión
      </NuxtLink>
    </p>
  </AuthCard>
</template>
