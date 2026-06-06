<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

const route = useRoute()
const verifyMutation = useStoreVerifyEmailMutation()
const resendMutation = useStoreResendVerificationMutation()

const email = ref('')
const code = ref('')
const errorMessage = ref('')
const infoMessage = ref('')
const verified = ref(false)
const devCode = ref('')
const source = computed(() =>
  typeof route.query.source === 'string' ? route.query.source : '',
)

const isSubmitting = computed(() => verifyMutation.isPending.value)
const isResending = computed(() => resendMutation.isPending.value)

async function submitVerification(payload: { token?: string; email?: string; code?: string }) {
  errorMessage.value = ''
  infoMessage.value = ''

  try {
    await verifyMutation.mutateAsync(payload)
    verified.value = true
    setTimeout(() => navigateTo('/cuenta'), 1500)
  } catch (error) {
    errorMessage.value = useApiErrorMessage(error)
  }
}

async function onSubmit() {
  if (!email.value.trim() || code.value.trim().length !== 6) {
    errorMessage.value = 'Ingresa tu correo y el código de 6 dígitos.'
    return
  }

  await submitVerification({
    email: email.value.trim(),
    code: code.value.trim(),
  })
}

async function onResend() {
  errorMessage.value = ''
  infoMessage.value = ''
  devCode.value = ''

  if (!email.value.trim()) {
    errorMessage.value = 'Ingresa tu correo para reenviar el código.'
    return
  }

  try {
    const result = await resendMutation.mutateAsync(email.value.trim())
    infoMessage.value = result.message
    if (result.verificationCode) {
      devCode.value = result.verificationCode
    }
  } catch (error) {
    errorMessage.value = useApiErrorMessage(error)
  }
}

onMounted(async () => {
  const queryEmail = route.query.email
  const queryCode = route.query.code
  const queryToken = route.query.token

  if (typeof queryEmail === 'string') {
    email.value = queryEmail
  }

  if (typeof queryCode === 'string' && queryCode.length === 6) {
    code.value = queryCode
    if (email.value) {
      await submitVerification({ email: email.value, code: queryCode })
    }
    return
  }

  if (typeof queryToken === 'string' && queryToken) {
    await submitVerification({ token: queryToken })
  }
})
</script>

<template>
  <AuthCard
    title="Verificar correo"
    :subtitle="
      source === 'google'
        ? 'Confirma tu correo para activar tu cuenta de Google'
        : 'Ingresa el código que enviamos a tu correo'
    "
  >
    <div v-if="verifyMutation.isPending && !code" class="text-center text-sm text-slate-600">
      Verificando tu cuenta…
    </div>

    <UiAlert v-else-if="verified" variant="success">
      ¡Cuenta verificada! Redirigiendo a tu perfil…
    </UiAlert>

    <form v-else class="space-y-4" @submit.prevent="onSubmit">
      <UiAlert v-if="errorMessage" variant="error">{{ errorMessage }}</UiAlert>
      <UiAlert v-if="infoMessage" variant="success">{{ infoMessage }}</UiAlert>

      <UiInput
        v-model="email"
        label="Correo electrónico"
        type="email"
        autocomplete="email"
        required
      />
      <UiInput
        v-model="code"
        label="Código de verificación"
        autocomplete="one-time-code"
        hint="Código de 6 dígitos enviado a tu correo"
        maxlength="6"
        required
      />

      <UiButton type="submit" class="w-full" :loading="isSubmitting">
        Verificar cuenta
      </UiButton>

      <UiButton
        type="button"
        variant="ghost"
        class="w-full"
        :loading="isResending"
        @click="onResend"
      >
        Reenviar código
      </UiButton>

      <p v-if="devCode" class="text-center text-xs text-slate-500">
        Código de desarrollo:
        <button
          type="button"
          class="font-mono font-semibold underline"
          @click="code = devCode"
        >
          {{ devCode }}
        </button>
      </p>
    </form>

    <p class="mt-6 text-center text-sm text-slate-600">
      <NuxtLink to="/login" class="text-brand-accent-deep font-semibold hover:underline">
        Volver al inicio de sesión
      </NuxtLink>
    </p>
  </AuthCard>
</template>
