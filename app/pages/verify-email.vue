<script setup lang="ts">
import { useField } from 'vee-validate'
import {
  resendVerificationSchema,
  verifyEmailFormSchema,
} from '~/utils/validation/schemas'

definePageMeta({
  layout: 'auth',
})

const route = useRoute()
const toast = useToast()
const verifyMutation = useStoreVerifyEmailMutation()
const resendMutation = useStoreResendVerificationMutation()
const { data: settings } = useStoreSettingsQuery()

const verified = ref(false)
const devCode = ref('')
const isAutoVerifying = ref(false)

function getQueryString(value: unknown): string | undefined {
  if (typeof value === 'string') {
    return value
  }

  if (Array.isArray(value) && typeof value[0] === 'string') {
    return value[0]
  }

  return undefined
}

const source = computed(() => getQueryString(route.query.source) ?? '')

const requiresTermsAcceptance = computed(() => source.value === 'google')

const isPendingRegistration = computed(
  () =>
    route.query.pendingVerification === '1' ||
    route.query.pendingVerification === 'true',
)

const {
  createSubmitHandler: createVerifySubmit,
  setValues,
  withMutationPending,
} = useApiForm({
  schema: verifyEmailFormSchema,
  initialValues: {
    email: '',
    code: '',
    acceptTerms: false,
  },
})

const { value: emailValue } = useField<string>('email')
const { value: acceptTerms } = useField<boolean>('acceptTerms')
const acceptTermsError = ref<string | undefined>()

const isSubmitting = withMutationPending(verifyMutation)
const isResending = computed(() => resendMutation.isPending.value)

useStoreSeo({
  title: 'Verificar correo',
  noindex: true,
})

const isDev = import.meta.dev

async function submitVerification(payload: {
  token?: string
  email?: string
  code?: string
  acceptTerms?: boolean
}) {
  try {
    await verifyMutation.mutateAsync(payload)
    verified.value = true
    toast.success('¡Cuenta verificada! Redirigiendo a tu perfil…')
    setTimeout(() => navigateTo('/cuenta'), 1500)
  } catch (error) {
    toast.error(useApiErrorMessage(error))
  } finally {
    isAutoVerifying.value = false
  }
}

const onSubmit = createVerifySubmit(
  async (values) => {
    if (requiresTermsAcceptance.value && !values.acceptTerms) {
      acceptTermsError.value = 'Debes aceptar los términos y condiciones.'
      toast.warning('Debes aceptar los términos y condiciones para continuar.')
      return
    }

    acceptTermsError.value = undefined
    await submitVerification({
      email: values.email,
      code: values.code,
      ...(requiresTermsAcceptance.value
        ? { acceptTerms: values.acceptTerms }
        : {}),
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
  verifyMutation.reset()

  const queryEmail = getQueryString(route.query.email)
  const queryCode = getQueryString(route.query.code)
  const queryToken = getQueryString(route.query.token)

  if (queryEmail) {
    setValues({ email: queryEmail })
  }

  if (queryCode && /^\d{6}$/.test(queryCode) && queryEmail) {
    setValues({ code: queryCode })
    isAutoVerifying.value = true
    await submitVerification({ email: queryEmail, code: queryCode })
    return
  }

  if (queryToken) {
    isAutoVerifying.value = true
    await submitVerification({ token: queryToken })
  }
})
</script>

<template>
  <AuthCard
    title="Verificar correo"
    :subtitle="
      source === 'google'
        ? 'Ingresa el código de 6 dígitos que enviamos a tu correo'
        : 'Ingresa el código que enviamos a tu correo'
    "
  >
    <div
      v-if="isAutoVerifying && verifyMutation.isPending && !verified"
      class="flex flex-col items-center gap-3 py-4"
      role="status"
      aria-live="polite"
    >
      <UiIcon name="lucide:loader-circle" :size="28" class="text-brand-accent animate-spin" />
      <p class="text-theme-muted text-sm">Verificando tu cuenta…</p>
    </div>

    <UiAlert
      v-else-if="verified"
      variant="success"
      role="status"
      aria-live="polite"
    >
      ¡Cuenta verificada! Redirigiendo a tu perfil…
    </UiAlert>

    <template v-else>
      <UiAlert
        v-if="source === 'google'"
        variant="info"
        class="mb-4"
      >
        Tu cuenta de Google está creada. Revisa tu bandeja de entrada (y spam) e
        ingresa el código de verificación para activarla.
      </UiAlert>

      <UiAlert
        v-if="isPendingRegistration"
        variant="warning"
        class="mb-4"
      >
        Tu cuenta está creada pero <strong>falta verificar el correo</strong> para poder
        iniciar sesión en la tienda. Revisa tu bandeja (y spam) o reenvía el código.
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
          name="code"
          label="Código de verificación"
          autocomplete="one-time-code"
          hint="Código de 6 dígitos enviado a tu correo"
          maxlength="6"
          required
        />

        <div v-if="requiresTermsAcceptance" class="space-y-1">
          <label class="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              class="border-store-line text-brand-accent mt-0.5 h-4 w-4 shrink-0 rounded focus:ring-[var(--brand-cyan)]"
              :class="acceptTermsError && 'border-red-500'"
              :checked="acceptTerms ?? false"
              @change="acceptTerms = ($event.target as HTMLInputElement).checked"
            />
            <span class="text-theme text-sm">
              Acepto los
              <a
                v-if="settings?.termsUrl"
                :href="settings.termsUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="text-brand-accent-deep font-semibold hover:underline"
                @click.stop
              >
                términos y condiciones
              </a>
              <span v-else>términos y condiciones</span>
              y la
              <a
                v-if="settings?.privacyPolicyUrl"
                :href="settings.privacyPolicyUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="text-brand-accent-deep font-semibold hover:underline"
                @click.stop
              >
                política de privacidad
              </a>
              <span v-else>política de privacidad</span>.
            </span>
          </label>
          <UiFieldMessage :error="acceptTermsError" />
        </div>

        <UiButton type="submit" class="w-full" icon="lucide:badge-check" :loading="isSubmitting">
          Verificar cuenta
        </UiButton>

        <UiButton
          type="button"
          variant="ghost"
          class="w-full"
          icon="lucide:mail"
          :loading="isResending"
          @click="onResend"
        >
          Reenviar código
        </UiButton>

        <p
          v-if="isDev && devCode"
          class="text-theme-muted text-center text-xs"
        >
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
    </template>

    <p class="text-theme-muted mt-6 text-center text-sm">
      <NuxtLink
        :to="{
          path: '/login',
          query: {
            ...(emailValue ? { email: emailValue } : {}),
            pendingVerification: '1',
          },
        }"
        class="text-brand-accent-deep font-semibold hover:underline"
      >
        Volver al inicio de sesión
      </NuxtLink>
    </p>
  </AuthCard>
</template>
