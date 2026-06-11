<script setup lang="ts">
import { useField } from 'vee-validate'
import { registerSchema } from '~/utils/validation/schemas'

definePageMeta({
  layout: 'auth',
  middleware: 'guest',
})

const registerMutation = useStoreRegisterMutation()
const { data: settings } = useStoreSettingsQuery()

const { createSubmitHandler, withMutationPending } = useApiForm({
  schema: registerSchema,
  initialValues: {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    acceptTerms: false,
  },
})

const { value: acceptTerms, errorMessage: acceptTermsError } =
  useField<boolean>('acceptTerms')

const isSubmitting = withMutationPending(registerMutation)

const onSubmit = createSubmitHandler(
  async (values) => {
    const result = await registerMutation.mutateAsync(values)

    await navigateTo({
      path: '/verify-email',
      query: {
        email: result.email,
        pendingVerification: '1',
        ...(result.verificationCode ? { code: result.verificationCode } : {}),
      },
    })
  },
  {
    successMessage: 'Cuenta creada. Revisa tu correo e ingresa el código.',
    invalidMessage: 'Completa los campos obligatorios correctamente.',
  },
)

useStoreSeo({
  title: 'Crear cuenta',
  noindex: true,
})
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
        required
      />
      <UiFormField
        name="password"
        label="Contraseña"
        type="password"
        autocomplete="new-password"
        hint="Mínimo 8 caracteres"
        required
      />

      <div class="space-y-1">
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

      <UiButton type="submit" class="w-full" :loading="isSubmitting">
        Registrarme
      </UiButton>
    </form>

    <p class="text-theme-muted mt-6 text-center text-sm">
      ¿Ya tienes cuenta?
      <NuxtLink to="/login" class="text-brand-accent-deep font-semibold hover:underline">
        Inicia sesión
      </NuxtLink>
    </p>
  </AuthCard>
</template>
