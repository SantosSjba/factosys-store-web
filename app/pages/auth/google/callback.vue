<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

const route = useRoute()
const authStore = useAuthStore()

const loading = ref(true)
const errorMessage = ref('')

onMounted(async () => {
  const access = route.query.accessToken
  const refresh = route.query.refreshToken
  const error = route.query.error

  if (typeof error === 'string') {
    errorMessage.value = decodeURIComponent(error)
    loading.value = false
    return
  }

  if (typeof access !== 'string' || typeof refresh !== 'string') {
    errorMessage.value =
      'No se recibieron los tokens de Google. Intenta iniciar sesión de nuevo.'
    loading.value = false
    return
  }

  try {
    authStore.setTokensFromCallback(access, refresh)
    await authStore.hydrateFromTokens()
    await navigateTo('/cuenta')
  } catch (e) {
    errorMessage.value = useApiErrorMessage(e)
    authStore.clearSession()
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <AuthCard title="Google" subtitle="Completando inicio de sesión">
    <div v-if="loading" class="text-center text-sm text-slate-600">
      Procesando autenticación con Google…
    </div>
    <UiAlert v-else-if="errorMessage" variant="error">
      {{ errorMessage }}
      <p class="mt-3">
        <NuxtLink to="/login" class="font-semibold underline">
          Volver al login
        </NuxtLink>
      </p>
    </UiAlert>
  </AuthCard>
</template>
