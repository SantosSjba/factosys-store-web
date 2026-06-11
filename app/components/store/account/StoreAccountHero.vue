<script setup lang="ts">
import type { StoreProfile } from '~/types/auth'
import type { StoreOrderSummary } from '~/types/store-orders'

const props = defineProps<{
  profile: StoreProfile
  orderCount?: number
  latestOrder?: StoreOrderSummary | null
}>()

const firstName = computed(() => props.profile.firstName?.trim() || 'Cliente')
const memberSince = computed(() => formatStoreDate(props.profile.createdAt))

const latestOrderCaption = computed(() =>
  props.latestOrder ? formatOrderDeliveryCaption(props.latestOrder) : null,
)
</script>

<template>
  <div class="border-theme bg-theme-surface rounded-2xl border p-5 shadow-sm sm:p-6">
    <div class="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
      <div class="min-w-0">
        <p class="text-theme-muted text-sm">Bienvenido de nuevo</p>
        <h2 class="text-theme mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          Hola, {{ firstName }}
        </h2>
        <p class="text-theme-muted mt-2 text-sm">
          Cliente desde {{ memberSince }}
        </p>
      </div>

      <div class="grid shrink-0 gap-3 sm:grid-cols-3 lg:max-w-xl">
        <div class="bg-theme-muted rounded-xl px-4 py-3 text-center">
          <p class="text-theme text-xl font-bold">{{ orderCount ?? 0 }}</p>
          <p class="text-theme-muted text-xs">Pedidos</p>
        </div>
        <div class="bg-theme-muted rounded-xl px-4 py-3 text-center">
          <UiBadge :variant="userStatusVariant(profile.status)" class="normal-case">
            {{ formatUserStatus(profile.status) }}
          </UiBadge>
          <p class="text-theme-muted mt-1 text-xs">Tu cuenta</p>
        </div>
        <NuxtLink
          v-if="latestOrder"
          :to="`/cuenta/pedidos/${latestOrder.id}`"
          class="border-theme bg-theme-muted/70 hover:border-[var(--brand-cyan)] rounded-xl border px-4 py-3 transition"
        >
          <p class="text-theme text-left text-sm font-semibold">Último pedido</p>
          <p class="text-theme-muted mt-1 line-clamp-2 text-left text-xs capitalize">
            {{ latestOrderCaption }}
          </p>
        </NuxtLink>
        <div
          v-else
          class="bg-theme-muted rounded-xl px-4 py-3 text-center"
        >
          <p class="text-theme text-sm font-semibold">Sin compras</p>
          <NuxtLink
            to="/productos"
            class="text-brand-accent-deep mt-1 inline-block text-xs font-medium hover:underline"
          >
            Ir al catálogo →
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
