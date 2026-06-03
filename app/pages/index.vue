<script setup lang="ts">
const config = useRuntimeConfig()
const authStore = useAuthStore()
</script>

<template>
  <section class="mx-auto max-w-6xl px-4 py-16">
    <div class="rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 p-10 text-white shadow-lg">
      <p class="text-sm font-semibold uppercase tracking-wide text-indigo-100">
        E-Commerce Tech Store
      </p>
      <h1 class="mt-2 text-4xl font-bold">{{ config.public.appName }}</h1>
      <p class="mt-4 max-w-2xl text-indigo-100">
        Frontend Nuxt 4 conectado a la API NestJS. Autenticación de cliente:
        registro, verificación de correo, login y Google OAuth.
      </p>
      <div class="mt-8 flex flex-wrap gap-3">
        <NuxtLink v-if="!authStore.isAuthenticated" to="/registro">
          <UiButton>Crear cuenta</UiButton>
        </NuxtLink>
        <NuxtLink v-else to="/cuenta">
          <UiButton>Ir a mi cuenta</UiButton>
        </NuxtLink>
        <NuxtLink to="/login">
          <UiButton variant="secondary">Iniciar sesión</UiButton>
        </NuxtLink>
      </div>
    </div>

    <div class="mt-10 grid gap-4 md:grid-cols-3">
      <article class="rounded-xl border border-slate-200 bg-white p-5">
        <h2 class="font-semibold text-slate-900">API</h2>
        <p class="mt-2 text-sm text-slate-600">
          Base: {{ config.public.apiBaseUrl }}
        </p>
      </article>
      <article class="rounded-xl border border-slate-200 bg-white p-5">
        <h2 class="font-semibold text-slate-900">Registro</h2>
        <p class="mt-2 text-sm text-slate-600">
          POST /store/auth/register y verificación en /verify-email
        </p>
      </article>
      <article class="rounded-xl border border-slate-200 bg-white p-5">
        <h2 class="font-semibold text-slate-900">Google</h2>
        <p class="mt-2 text-sm text-slate-600">
          OAuth vía GET /store/auth/google
        </p>
      </article>
    </div>
  </section>
</template>
