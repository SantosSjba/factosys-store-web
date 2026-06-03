<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  middleware: 'guest',
})

const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const firstName = ref('')
const lastName = ref('')
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const devToken = ref('')

async function onSubmit() {
  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''
  devToken.value = ''
  try {
    const result = await authStore.register({
      email: email.value,
      password: password.value,
      firstName: firstName.value || undefined,
      lastName: lastName.value || undefined,
    })
    successMessage.value = result.message
    if (result.verificationToken) {
      devToken.value = result.verificationToken
    }
  } catch (error) {
    errorMessage.value = useApiErrorMessage(error)
  } finally {
    loading.value = false
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
      <UiAlert v-if="successMessage" variant="success">
        {{ successMessage }}
        <p v-if="devToken" class="mt-2 text-xs">
          Token de desarrollo (si el correo no se envió):
          <NuxtLink
            :to="`/verify-email?token=${devToken}`"
            class="font-mono underline"
          >
            verificar ahora
          </NuxtLink>
        </p>
      </UiAlert>

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

      <UiButton type="submit" class="w-full" :loading="loading">
        Registrarme
      </UiButton>
    </form>

    <p class="mt-6 text-center text-sm text-slate-600">
      ¿Ya tienes cuenta?
      <NuxtLink to="/login" class="font-semibold text-indigo-600 hover:underline">
        Inicia sesión
      </NuxtLink>
    </p>
  </AuthCard>
</template>
