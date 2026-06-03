<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const authStore = useAuthStore()
const loading = ref(true)
const errorMessage = ref('')

onMounted(async () => {
  try {
    await authStore.fetchProfile()
  } catch (error) {
    errorMessage.value = useApiErrorMessage(error)
  } finally {
    loading.value = false
  }
})

const displayName = computed(() => {
  const profile = authStore.profile
  if (!profile) return ''
  const parts = [profile.firstName, profile.lastName].filter(Boolean)
  return parts.length > 0 ? parts.join(' ') : profile.email
})
</script>

<template>
  <section class="mx-auto max-w-3xl px-4 py-12">
    <h1 class="text-2xl font-bold text-slate-900">Mi cuenta</h1>
    <p class="mt-1 text-sm text-slate-600">Perfil sincronizado con GET /api/store/me</p>

    <div v-if="loading" class="mt-8 text-sm text-slate-500">Cargando perfil…</div>

    <UiAlert v-else-if="errorMessage" variant="error" class="mt-8">
      {{ errorMessage }}
    </UiAlert>

    <div
      v-else-if="authStore.profile"
      class="mt-8 space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div>
        <p class="text-xs font-medium uppercase text-slate-500">Nombre</p>
        <p class="text-lg font-semibold">{{ displayName }}</p>
      </div>
      <div>
        <p class="text-xs font-medium uppercase text-slate-500">Correo</p>
        <p>{{ authStore.profile.email }}</p>
      </div>
      <div>
        <p class="text-xs font-medium uppercase text-slate-500">Estado</p>
        <p>{{ authStore.profile.status }}</p>
      </div>
      <div>
        <p class="text-xs font-medium uppercase text-slate-500">Roles</p>
        <p>{{ authStore.profile.roles.join(', ') || '—' }}</p>
      </div>
      <div>
        <p class="text-xs font-medium uppercase text-slate-500">Permisos</p>
        <p class="text-sm text-slate-600">
          {{ authStore.profile.permissions.length }} asignados
        </p>
      </div>
    </div>
  </section>
</template>
