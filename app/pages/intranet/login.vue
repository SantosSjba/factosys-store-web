<script setup lang="ts">
import { ApiError } from '~/types/api'
import { loginSchema } from '~/utils/validation/schemas'

definePageMeta({
  layout: 'auth',
  middleware: 'admin-guest',
})

const route = useRoute()
const toast = useToast()
const loginMutation = useAdminLoginMutation()

const { createSubmitHandler, meta } = useApiForm({
  schema: loginSchema,
  initialValues: {
    email: '',
    password: '',
  },
})

const isSubmitting = computed(
  () => loginMutation.isPending.value || meta.value.pending,
)

const onSubmit = createSubmitHandler(
  async (values) => {
    try {
      await loginMutation.mutateAsync(values)
      toast.success('Sesión iniciada correctamente')
      const redirect =
        typeof route.query.redirect === 'string'
          ? route.query.redirect
          : '/intranet'
      await navigateTo(redirect)
    } catch (error) {
      let message = useApiErrorMessage(error)
      if (error instanceof ApiError && error.code === 'AUTH_CONTEXT_MISMATCH') {
        message +=
          ' Usa una cuenta de personal (staff). Los clientes entran por la tienda.'
      }
      toast.error(message)
    }
  },
  { invalidMessage: 'Ingresa un correo y contraseña válidos.' },
)
</script>

<template>
  <AuthCard
    title="Intranet"
    subtitle="Acceso para administración y personal autorizado"
  >
    <form class="space-y-4" @submit.prevent="onSubmit">
      <UiFormField
        name="email"
        label="Correo corporativo"
        type="email"
        autocomplete="username"
      />
      <UiFormField
        name="password"
        label="Contraseña"
        type="password"
        autocomplete="current-password"
      />

      <UiButton type="submit" class="w-full" :loading="isSubmitting">
        Entrar al panel
      </UiButton>
    </form>

    <p class="mt-4 rounded-lg bg-violet-50 px-3 py-2 text-xs text-violet-900">
      Staff (dev): <strong>admin@factosys.store</strong> / Admin123! o
      <strong>super@factosys.store</strong> / Super123!
    </p>

    <p class="mt-6 text-center text-sm text-slate-600">
      ¿Eres cliente?
      <NuxtLink to="/login" class="font-semibold text-indigo-600 hover:underline">
        Inicia sesión en la tienda
      </NuxtLink>
    </p>
  </AuthCard>
</template>
