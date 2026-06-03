<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

const route = useRoute()
const verifyMutation = useStoreVerifyEmailMutation()

const errorMessage = ref('')
const verified = ref(false)

async function verify(token: string) {
  errorMessage.value = ''
  try {
    await verifyMutation.mutateAsync(token)
    verified.value = true
    setTimeout(() => navigateTo('/cuenta'), 1500)
  } catch (error) {
    errorMessage.value = useApiErrorMessage(error)
  }
}

onMounted(async () => {
  const token = route.query.token
  if (typeof token !== 'string' || !token) {
    errorMessage.value =
      'Enlace inválido. Abre el enlace que recibiste por correo o pega el token.'
    return
  }
  await verify(token)
})
</script>

<template>
  <AuthCard
    title="Verificar correo"
    subtitle="Activando tu cuenta de cliente"
  >
    <div v-if="verifyMutation.isPending" class="text-center text-sm text-slate-600">
      Verificando tu cuenta…
    </div>

    <UiAlert v-else-if="verified" variant="success">
      ¡Cuenta verificada! Redirigiendo a tu perfil…
    </UiAlert>

    <UiAlert v-else-if="errorMessage" variant="error">
      {{ errorMessage }}
      <p class="mt-3">
        <NuxtLink to="/login" class="font-semibold underline">
          Ir a iniciar sesión
        </NuxtLink>
      </p>
    </UiAlert>
  </AuthCard>
</template>
