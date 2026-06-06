<script setup lang="ts">
import { useField } from 'vee-validate'
import { resendVerificationSchema, verifyEmailSchema } from '~/utils/validation/schemas'

definePageMeta({
  layout: 'auth',
})

const route = useRoute()
const toast = useToast()
const verifyMutation = useStoreVerifyEmailMutation()
const resendMutation = useStoreResendVerificationMutation()

const verified = ref(false)
const devCode = ref('')

const source = computed(() =>
  typeof route.query.source === 'string' ? route.query.source : '',
)

const {
  createSubmitHandler: createVerifySubmit,
  setValues,
  meta: verifyMeta,
} = useApiForm({
  schema: verifyEmailSchema,
  initialValues: {
    email: '',
    code: '',
  },
})

const { value: emailValue } = useField<string>('email')

const isSubmitting = computed(
  () => verifyMutation.isPending.value || verifyMeta.value.pending,
)
const isResending = computed(() => resendMutation.isPending.value)

async function submitVerification(payload: {
  token?: string
  email?: string
  code?: string
}) {
  try {
    await verifyMutation.mutateAsync(payload)
    verified.value = true
    toast.success('¡Cuenta verificada! Redirigiendo a tu perfil…')
    setTimeout(() => navigateTo('/cuenta'), 1500)
  } catch (error) {
    toast.error(useApiErrorMessage(error))
  }
}

const onSubmit = createVerifySubmit(
  async (values) => {
    await submitVerification({
      email: values.email,
      code: values.code,
    })
  },
  { invalidMessage: 'Ingresa tu correo y el código de 6 dígitos.' },
)

async function onResend() {
  const parsed = resendVerificationSchema.safeParse({
    email: emailValue.value?.trim() ?? '',
  })

  if (!parsed.success) {
    toast.warning('Ingresa tu correo para reenviar el código.')
    return
  }

  try {
    const result = await resendMutation.mutateAsync(parsed.data.email)
    toast.success(result.message)
    if (result.verificationCode) {
      devCode.value = result.verificationCode
    }
  } catch (error) {
    toast.error(useApiErrorMessage(error))
  }
}

onMounted(async () => {
  const queryEmail = route.query.email
  const queryCode = route.query.code
  const queryToken = route.query.token

  if (typeof queryEmail === 'string') {
    setValues({ email: queryEmail })
  }

  if (typeof queryCode === 'string' && queryCode.length === 6) {
    setValues({ code: queryCode })
    if (typeof queryEmail === 'string') {
      await submitVerification({ email: queryEmail, code: queryCode })
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
    <div v-if="verifyMutation.isPending && !verified" class="text-center text-sm text-slate-600">
      Verificando tu cuenta…
    </div>

    <UiAlert v-else-if="verified" variant="success">
      ¡Cuenta verificada! Redirigiendo a tu perfil…
    </UiAlert>

    <form v-else class="space-y-4" @submit.prevent="onSubmit">
      <UiFormField
        name="email"
        label="Correo electrónico"
        type="email"
        autocomplete="email"
      />
      <UiFormField
        name="code"
        label="Código de verificación"
        autocomplete="one-time-code"
        hint="Código de 6 dígitos enviado a tu correo"
        maxlength="6"
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
          @click="setValues({ code: devCode })"
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
