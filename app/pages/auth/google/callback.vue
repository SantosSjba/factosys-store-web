<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

const route = useRoute()
const toast = useToast()
const authStore = useAuthStore()

const loading = ref(true)

onMounted(async () => {
  const access = route.query.accessToken
  const refresh = route.query.refreshToken
  const error = route.query.error

  if (typeof error === 'string') {
    toast.error(decodeURIComponent(error))
    loading.value = false
    return
  }

  if (typeof access !== 'string' || typeof refresh !== 'string') {
    toast.error('No se recibieron los tokens de Google. Intenta iniciar sesión de nuevo.')
    loading.value = false
    return
  }

  try {
    authStore.setTokensFromCallback(access, refresh)
    await authStore.hydrateFromTokens()
    toast.success('Sesión iniciada con Google')
    await navigateTo('/cuenta')
  } catch (e) {
    toast.error(useApiErrorMessage(e))
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
    <p v-else class="text-center text-sm text-slate-600">
      <NuxtLink to="/login" class="font-semibold underline">
        Volver al login
      </NuxtLink>
    </p>
  </AuthCard>
</template>
