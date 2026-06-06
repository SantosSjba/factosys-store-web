<script setup lang="ts">
import { ApiError } from '~/types/api'
import { loginSchema } from '~/utils/validation/schemas'

definePageMeta({
  layout: 'auth',
  middleware: 'guest',
})

const route = useRoute()
const toast = useToast()
const loginMutation = useStoreLoginMutation()
const authStore = useAuthStore()

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
      const redirect =
        typeof route.query.redirect === 'string' ? route.query.redirect : '/cuenta'
      await navigateTo(redirect)
    } catch (error) {
      let message = useApiErrorMessage(error)
      if (error instanceof ApiError && error.code === 'EMAIL_NOT_VERIFIED') {
        message += ' Revisa tu correo o vuelve a registrarte.'
      }
      if (error instanceof ApiError && error.code === 'AUTH_CONTEXT_MISMATCH') {
        message +=
          ' Las cuentas super@ / admin@ son del panel admin, no de la tienda.'
      }
      toast.error(message)
    }
  },
  { invalidMessage: 'Ingresa un correo y contraseña válidos.' },
)
</script>

<template>
  <AuthCard
    title="Iniciar sesión"
    subtitle="Accede a tu cuenta de cliente en la tienda"
  >
    <form class="space-y-4" @submit.prevent="onSubmit">
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
        autocomplete="current-password"
      />

      <UiButton type="submit" class="w-full" :loading="isSubmitting">
        Entrar
      </UiButton>
    </form>

    <p class="mt-4 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
      Tienda (dev): <strong>cliente@factosys.store</strong> / Cliente123!
    </p>

    <div class="mt-6 space-y-3 border-t border-slate-100 pt-6 text-center text-sm">
      <a
        :href="authStore.googleAuthUrl"
        class="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white px-4 py-2.5 font-medium text-slate-800 shadow-sm transition hover:bg-slate-50"
      >
        <UiIcon name="logos:google-icon" :size="20" />
        Continuar con Google
      </a>
      <p class="text-slate-600">
        ¿No tienes cuenta?
        <NuxtLink to="/registro" class="text-brand-accent-deep font-semibold hover:underline">
          Regístrate
        </NuxtLink>
      </p>
      <p class="text-slate-500">
        ¿Personal de Factosys?
        <NuxtLink to="/intranet/login" class="font-semibold text-violet-700 hover:underline">
          Acceso intranet
        </NuxtLink>
      </p>
    </div>
  </AuthCard>
</template>
