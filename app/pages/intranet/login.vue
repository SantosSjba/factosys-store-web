<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  middleware: 'admin-guest',
})

const loginMutation = useAdminLoginMutation()

const { onSubmit, isSubmitting } = useAuthLoginSubmit({
  mutation: loginMutation,
  redirectDefault: '/intranet',
  successMessage: 'Sesión iniciada correctamente',
  contextMismatchSuffix:
    ' Usa una cuenta de personal (staff). Los clientes entran por la tienda.',
})
</script>

<template>
  <AuthCard
    title="Intranet"
    subtitle="Acceso para administración y personal autorizado"
  >
    <form class="space-y-4" @submit.prevent="onSubmit">
      <UiFormField
        name="email"
        label="Correo corporativo"
        type="email"
        autocomplete="username"
        required
      />
      <UiFormField
        name="password"
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
