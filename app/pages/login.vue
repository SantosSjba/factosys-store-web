<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  middleware: 'guest',
})

const route = useRoute()
const loginMutation = useStoreLoginMutation()
const authStore = useAuthStore()

const { onSubmit, isSubmitting, setValues } = useAuthLoginSubmit({
  mutation: loginMutation,
  redirectDefault: '/cuenta',
  contextMismatchSuffix:
    ' Las cuentas super@ / admin@ son del panel admin, no de la tienda.',
})

const pendingEmail = computed(() =>
  typeof route.query.email === 'string' ? route.query.email : '',
)

const showPendingVerification = computed(
  () =>
    route.query.pendingVerification === '1' ||
    route.query.pendingVerification === 'true',
)

const verifyEmailLink = computed(() => ({
  path: '/verify-email',
  query: pendingEmail.value ? { email: pendingEmail.value } : {},
}))

onMounted(() => {
  if (pendingEmail.value) {
    setValues({ email: pendingEmail.value, password: '' })
  }
})
</script>

<template>
  <AuthCard
    title="Iniciar sesión"
    subtitle="Accede a tu cuenta de cliente en la tienda"
  >
    <UiAlert
      v-if="showPendingVerification"
      variant="warning"
      class="mb-4"
    >
      <p class="font-medium">Falta verificar tu correo</p>
      <p class="mt-1">
        Tu cuenta fue creada pero aún no está activa. Revisa tu bandeja de entrada
        e ingresa el código de 6 dígitos para poder iniciar sesión.
      </p>
      <NuxtLink
        :to="verifyEmailLink"
        class="mt-2 inline-block font-semibold underline"
      >
        Ir a verificar mi correo
      </NuxtLink>
    </UiAlert>

    <form class="space-y-4" @submit.prevent="onSubmit">
      <UiFormField
        name="email"
        label="Correo electrónico"
        type="email"
        autocomplete="email"
        required
      />
      <UiFormField
        name="password"
        label="Contraseña"
        type="password"
        autocomplete="current-password"
        required
      />

      <UiButton type="submit" class="w-full" :loading="isSubmitting">
        Entrar
      </UiButton>
    </form>

    <p class="mt-4 text-center text-sm text-slate-600">
      ¿No verificaste tu correo?
      <NuxtLink
        :to="verifyEmailLink"
        class="text-brand-accent-deep font-semibold hover:underline"
      >
        Ingresar código de verificación
      </NuxtLink>
    </p>

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
