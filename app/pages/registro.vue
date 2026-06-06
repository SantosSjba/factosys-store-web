<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  middleware: 'guest',
})

const registerMutation = useStoreRegisterMutation()
const isSubmitting = computed(() => registerMutation.isPending.value)

const email = ref('')
const password = ref('')
const firstName = ref('')
const lastName = ref('')
const errorMessage = ref('')

async function onSubmit() {
  errorMessage.value = ''
  try {
    const result = await registerMutation.mutateAsync({
      email: email.value,
      password: password.value,
      firstName: firstName.value || undefined,
      lastName: lastName.value || undefined,
    })

    await navigateTo({
      path: '/verify-email',
      query: {
        email: result.email,
        ...(result.verificationCode ? { code: result.verificationCode } : {}),
      },
    })
  } catch (error) {
    errorMessage.value = useApiErrorMessage(error)
  }
}
</script>

<template>
  <AuthCard
    title="Crear cuenta"
    subtitle="Registro de cliente en la tienda Factosys"
  >
    <form class="space-y-4" @submit.prevent="onSubmit">
      <UiAlert v-if="errorMessage" variant="error">{{ errorMessage }}</UiAlert>

      <div class="grid gap-4 sm:grid-cols-2">
        <UiInput v-model="firstName" label="Nombre" autocomplete="given-name" />
        <UiInput v-model="lastName" label="Apellido" autocomplete="family-name" />
      </div>
      <UiInput
        v-model="email"
        label="Correo electrónico"
        type="email"
        autocomplete="email"
        required
      />
      <UiInput
        v-model="password"
        label="Contraseña"
        type="password"
        autocomplete="new-password"
        hint="Mínimo 8 caracteres"
        required
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
