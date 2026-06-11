<script setup lang="ts">
import type { StoreProfile } from '~/types/auth'

defineProps<{
  profile: StoreProfile
}>()

const emit = defineEmits<{
  logout: []
}>()
</script>

<template>
  <section class="space-y-8">
    <div>
      <h3 class="text-theme text-lg font-bold sm:text-xl">Mi perfil</h3>
      <p class="text-theme-muted mt-1 text-sm">
        Actualiza tus datos y revisa la información de tu cuenta.
      </p>
    </div>

    <div class="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
      <div class="border-theme bg-theme-muted/30 rounded-2xl border p-5 sm:p-6">
        <StoreAccountProfileForm :profile="profile" />
      </div>

      <aside class="space-y-4">
        <div class="border-theme bg-theme-muted/40 rounded-2xl border p-5">
          <p class="text-theme-muted text-xs font-medium uppercase tracking-wide">
            Correo
          </p>
          <p class="text-theme mt-1 break-all font-medium">{{ profile.email }}</p>

          <p class="text-theme-muted mt-4 text-xs font-medium uppercase tracking-wide">
            Acceso
          </p>
          <p class="text-theme mt-1 text-sm">
            {{ formatAuthProvider(profile.authProvider) }}
          </p>

          <p class="text-theme-muted mt-4 text-xs font-medium uppercase tracking-wide">
            Estado
          </p>
          <div class="mt-1">
            <UiBadge :variant="userStatusVariant(profile.status)" class="normal-case">
              {{ formatUserStatus(profile.status) }}
            </UiBadge>
          </div>

          <p class="text-theme-muted mt-4 text-xs font-medium uppercase tracking-wide">
            Cliente desde
          </p>
          <p class="text-theme mt-1 text-sm">
            {{ formatStoreDate(profile.createdAt) }}
          </p>
        </div>

        <div class="flex flex-col gap-3">
          <NuxtLink to="/productos">
            <UiButton variant="secondary" icon="lucide:store" class="w-full">
              Seguir comprando
            </UiButton>
          </NuxtLink>
          <UiButton
            variant="ghost"
            icon="lucide:log-out"
            class="w-full"
            @click="emit('logout')"
          >
            Cerrar sesión
          </UiButton>
        </div>
      </aside>
    </div>

    <div class="border-theme border-t pt-8">
      <StoreAccountAddresses />
    </div>
  </section>
</template>
