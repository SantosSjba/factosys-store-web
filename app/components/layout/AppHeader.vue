<script setup lang="ts">
const config = useRuntimeConfig()
const authStore = useAuthStore()

async function handleLogout() {
  await authStore.logout()
  await navigateTo('/')
}
</script>

<template>
  <header class="border-b border-slate-200 bg-white">
    <div
      class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4"
    >
      <NuxtLink to="/" class="text-lg font-bold text-indigo-700">
        {{ config.public.appName }}
      </NuxtLink>

      <nav class="flex items-center gap-3 text-sm font-medium">
        <template v-if="authStore.isAuthenticated">
          <NuxtLink to="/cuenta" class="text-slate-600 hover:text-indigo-600">
            Mi cuenta
          </NuxtLink>
          <UiButton variant="ghost" @click="handleLogout">Cerrar sesión</UiButton>
        </template>
        <template v-else>
          <NuxtLink to="/login" class="text-slate-600 hover:text-indigo-600">
            Iniciar sesión
          </NuxtLink>
          <NuxtLink to="/registro">
            <UiButton>Crear cuenta</UiButton>
          </NuxtLink>
        </template>
      </nav>
    </div>
  </header>
</template>
