<script setup lang="ts">
import { ApiError } from '~/types/api'

definePageMeta({
  layout: 'auth',
  middleware: 'admin-guest',
})

const route = useRoute()
const loginMutation = useAdminLoginMutation()
const isSubmitting = computed(() => loginMutation.isPending.value)

const email = ref('')
const password = ref('')
const errorMessage = ref('')

async function onSubmit() {
  errorMessage.value = ''
  try {
    await loginMutation.mutateAsync({
      email: email.value,
      password: password.value,
    })
    useToast().success('Sesión iniciada correctamente')
    const redirect =
      typeof route.query.redirect === 'string'
        ? route.query.redirect
        : '/intranet'
    await navigateTo(redirect)
  } catch (error) {
    errorMessage.value = useApiErrorMessage(error)
    if (error instanceof ApiError && error.code === 'AUTH_CONTEXT_MISMATCH') {
      errorMessage.value +=
        ' Usa una cuenta de personal (staff). Los clientes entran por la tienda.'
    }
  }
}
</script>

<template>
  <AuthCard
    title="Intranet"
    subtitle="Acceso para administración y personal autorizado"
  >
    <form class="space-y-4" @submit.prevent="onSubmit">
      <UiAlert v-if="errorMessage" variant="error">{{ errorMessage }}</UiAlert>

      <UiInput
        v-model="email"
        label="Correo corporativo"
        type="email"
        autocomplete="username"
        required
      />
      <UiInput
        v-model="password"
        label="Contraseña"
        type="password"
        autocomplete="current-password"
        required
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
