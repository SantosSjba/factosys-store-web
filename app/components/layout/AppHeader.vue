<script setup lang="ts">
const config = useRuntimeConfig()
const route = useRoute()
const authStore = useAuthStore()

const isIntranetRoute = computed(() => route.path.startsWith('/intranet'))

async function handleStoreLogout() {
  await authStore.logout()
  await navigateTo('/')
}
</script>

<template>
  <header class="border-b border-slate-200 bg-white shadow-sm">
    <div class="border-b border-slate-100 bg-slate-50">
      <div
        class="mx-auto flex max-w-6xl items-center justify-end gap-2 px-4 py-1.5 text-xs text-slate-600"
      >
        <span class="hidden sm:inline">¿Eres del equipo?</span>
        <NuxtLink
          to="/intranet"
          class="font-semibold text-violet-700 hover:text-violet-900"
          :class="{ 'text-violet-900 underline': isIntranetRoute }"
        >
          Acceso intranet
        </NuxtLink>
      </div>
    </div>

    <div
      class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4"
    >
      <div class="flex items-center gap-6">
        <NuxtLink to="/" class="text-lg font-bold text-indigo-700">
          {{ config.public.appName }}
        </NuxtLink>
        <nav class="hidden items-center gap-4 text-sm font-medium text-slate-600 sm:flex">
          <NuxtLink to="/" class="hover:text-indigo-600" active-class="text-indigo-600">
            Inicio
          </NuxtLink>
        </nav>
      </div>

      <nav
        class="flex flex-wrap items-center gap-2 text-sm font-medium sm:gap-3"
        aria-label="Cuenta de cliente"
      >
        <span
          class="mr-1 hidden text-xs uppercase tracking-wide text-slate-400 lg:inline"
        >
          Tienda
        </span>

        <template v-if="authStore.isAuthenticated">
          <NuxtLink
            to="/cuenta"
            class="rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-100 hover:text-indigo-600"
          >
            Mi cuenta
          </NuxtLink>
          <UiButton variant="ghost" @click="handleStoreLogout">
            Cerrar sesión
          </UiButton>
        </template>
        <template v-else>
          <NuxtLink
            to="/login"
            class="rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-100 hover:text-indigo-600"
          >
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
