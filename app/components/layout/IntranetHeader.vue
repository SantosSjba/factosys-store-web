<script setup lang="ts">
const config = useRuntimeConfig()
const adminAuth = useAdminAuthStore()

async function handleLogout() {
  await adminAuth.logout()
  await navigateTo('/intranet/login')
}
</script>

<template>
  <header class="border-b border-violet-200 bg-white shadow-sm">
    <div class="border-b border-violet-100 bg-violet-50">
      <div
        class="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-1.5 text-xs"
      >
        <NuxtLink to="/" class="text-slate-600 hover:text-indigo-600">
          ← Volver a la tienda
        </NuxtLink>
        <span class="font-medium text-violet-800">Área interna · Staff</span>
      </div>
    </div>

    <div
      class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4"
    >
      <NuxtLink to="/intranet" class="text-lg font-bold text-violet-800">
        {{ config.public.appName }} Intranet
      </NuxtLink>

      <nav
        class="flex flex-wrap items-center gap-2 text-sm font-medium sm:gap-3"
        aria-label="Sesión intranet"
      >
        <template v-if="adminAuth.isAuthenticated">
          <span class="hidden text-slate-600 sm:inline">
            {{ adminAuth.displayName }}
          </span>
          <NuxtLink
            to="/intranet"
            class="rounded-lg px-3 py-2 text-slate-700 hover:bg-violet-50 hover:text-violet-800"
          >
            Panel
          </NuxtLink>
          <UiButton variant="ghost" @click="handleLogout">Cerrar sesión</UiButton>
        </template>
        <template v-else>
          <NuxtLink to="/intranet/login">
            <UiButton>Iniciar sesión</UiButton>
          </NuxtLink>
        </template>
      </nav>
    </div>
  </header>
</template>
