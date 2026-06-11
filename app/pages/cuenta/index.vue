<script setup lang="ts">
import type { StoreAccountTab } from '~/types/store-account'

definePageMeta({
  middleware: 'auth',
})

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const { data: profile, isPending, isError, error, refetch } = useStoreProfileQuery()
const { data: ordersPage } = useStoreOrdersQuery(() => ({ page: 1, limit: 1 }))

const latestOrder = computed(() => ordersPage.value?.items[0] ?? null)

useQueryErrorToast(isError, error)

const activeTab = computed<StoreAccountTab>({
  get() {
    const tab = route.query.tab
    if (tab === 'perfil' || tab === 'ayuda' || tab === 'compras') return tab
    return 'compras'
  },
  set(value) {
    router.replace({ query: { ...route.query, tab: value } })
  },
})

const orderCount = computed(() => ordersPage.value?.meta.total ?? 0)

useStoreSeo({
  title: 'Mi cuenta',
  noindex: true,
})

async function handleLogout() {
  await authStore.logout()
  await navigateTo('/')
}
</script>

<template>
  <section class="mx-auto max-w-7xl px-4 py-8 sm:py-12">
    <UiPageHeader
      title="Mi cuenta"
      description="Gestiona tus compras, perfil y soporte desde un solo lugar."
      :breadcrumb="[
        { label: 'Inicio', to: '/' },
        { label: 'Mi cuenta' },
      ]"
    />

    <div
      v-if="isPending"
      class="space-y-6"
    >
      <UiSkeleton tone="store" height="140px" class="rounded-2xl" />
      <div class="grid gap-3 sm:grid-cols-3">
        <UiSkeleton
          v-for="index in 3"
          :key="index"
          tone="store"
          height="120px"
          class="rounded-2xl"
        />
      </div>
      <UiSkeleton tone="store" height="280px" class="rounded-2xl" />
    </div>

    <UiErrorState
      v-else-if="isError"
      title="No pudimos cargar tu perfil"
      @retry="refetch()"
    />

    <div
      v-else-if="profile"
      class="space-y-6"
    >
      <StoreAccountHero
        :profile="profile"
        :order-count="orderCount"
        :latest-order="latestOrder"
      />

      <StoreAccountNav v-model="activeTab" />

      <div class="border-theme bg-theme-surface rounded-2xl border p-5 shadow-sm sm:p-6">
        <StoreAccountOrders v-if="activeTab === 'compras'" />
        <StoreAccountProfile
          v-else-if="activeTab === 'perfil'"
          :profile="profile"
          @logout="handleLogout"
        />
        <StoreAccountHelp v-else />
      </div>
    </div>
  </section>
</template>
