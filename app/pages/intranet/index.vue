<script setup lang="ts">
definePageMeta({
  layout: 'intranet',
  middleware: 'admin-auth',
})

const adminAuth = useAdminAuthStore()
const { data: profile, isPending } = useAdminProfileQuery()
</script>

<template>
  <section class="mx-auto max-w-4xl px-4 py-12">
    <div class="rounded-2xl border border-violet-200 bg-white p-8 shadow-sm">
      <p class="text-sm font-medium uppercase tracking-wide text-violet-700">
        Intranet
      </p>
      <h1 class="mt-2 text-2xl font-bold text-slate-900">
        Bienvenido, {{ adminAuth.displayName || 'usuario staff' }}
      </h1>
      <p class="mt-2 text-slate-600">
        Panel base conectado a la API administrativa. Aquí irán catálogo,
        pedidos, usuarios y reportes.
      </p>

      <div v-if="isPending" class="mt-8 text-sm text-slate-500">
        Cargando perfil…
      </div>

      <div
        v-else-if="profile"
        class="mt-8 grid gap-4 sm:grid-cols-2"
      >
        <div class="rounded-lg bg-slate-50 p-4">
          <p class="text-xs font-medium uppercase text-slate-500">Correo</p>
          <p class="mt-1 font-medium">{{ profile.email }}</p>
        </div>
        <div class="rounded-lg bg-slate-50 p-4">
          <p class="text-xs font-medium uppercase text-slate-500">Roles</p>
          <p class="mt-1 font-medium">
            {{ profile.roles.join(', ') || '—' }}
          </p>
        </div>
        <div class="rounded-lg bg-slate-50 p-4 sm:col-span-2">
          <p class="text-xs font-medium uppercase text-slate-500">
            Permisos
          </p>
          <p class="mt-1 text-sm text-slate-700">
            {{ profile.permissions.length }} permisos asignados
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
