<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const { data: profile, isPending, isError, error } = useStoreProfileQuery()

useQueryErrorToast(isError, error)

const displayName = computed(() =>
  profile.value ? formatUserName(profile.value) : '',
)
</script>

<template>
  <section class="mx-auto max-w-3xl px-4 py-12">
    <h1 class="text-2xl font-bold text-slate-900">Mi cuenta</h1>
    <p class="mt-1 text-sm text-slate-600">Perfil sincronizado con GET /api/store/me</p>

    <div v-if="isPending" class="mt-8 text-sm text-slate-500">Cargando perfil…</div>

    <div
      v-else-if="profile"
      class="mt-8 space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div>
        <p class="text-xs font-medium uppercase text-slate-500">Nombre</p>
        <p class="text-lg font-semibold">{{ displayName }}</p>
      </div>
      <div>
        <p class="text-xs font-medium uppercase text-slate-500">Correo</p>
        <p>{{ profile.email }}</p>
      </div>
      <div>
        <p class="text-xs font-medium uppercase text-slate-500">Estado</p>
        <p>{{ profile.status }}</p>
      </div>
      <div>
        <p class="text-xs font-medium uppercase text-slate-500">Roles</p>
        <p>{{ profile.roles.join(', ') || '—' }}</p>
      </div>
      <div>
        <p class="text-xs font-medium uppercase text-slate-500">Permisos</p>
        <p class="text-sm text-slate-600">
          {{ profile.permissions.length }} asignados
        </p>
      </div>
    </div>
  </section>
</template>
