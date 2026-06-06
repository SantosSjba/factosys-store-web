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
    <h1 class="text-theme text-2xl font-bold">Mi cuenta</h1>
    <p class="text-theme-muted mt-1 text-sm">
      Consulta los datos de tu perfil en la tienda.
    </p>

    <div v-if="isPending" class="text-theme-muted mt-8 text-sm">
      Cargando perfil…
    </div>

    <div
      v-else-if="profile"
      class="border-theme bg-theme mt-8 rounded-2xl border p-6 shadow-sm"
    >
      <div class="grid gap-5 sm:grid-cols-2">
        <div>
          <p class="text-theme-muted text-xs font-medium uppercase tracking-wide">
            Nombre
          </p>
          <p class="text-theme mt-1 text-lg font-semibold">{{ displayName }}</p>
        </div>

        <div>
          <p class="text-theme-muted text-xs font-medium uppercase tracking-wide">
            Correo
          </p>
          <p class="text-theme mt-1">{{ profile.email }}</p>
        </div>

        <div>
          <p class="text-theme-muted text-xs font-medium uppercase tracking-wide">
            Teléfono
          </p>
          <p class="text-theme mt-1">{{ profile.phone || '—' }}</p>
        </div>

        <div>
          <p class="text-theme-muted text-xs font-medium uppercase tracking-wide">
            Estado de la cuenta
          </p>
          <div class="mt-1">
            <UiBadge :variant="userStatusVariant(profile.status)">
              {{ formatUserStatus(profile.status) }}
            </UiBadge>
          </div>
        </div>

        <div class="sm:col-span-2">
          <p class="text-theme-muted text-xs font-medium uppercase tracking-wide">
            Cliente desde
          </p>
          <p class="text-theme mt-1">{{ formatAdminDate(profile.createdAt) }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
