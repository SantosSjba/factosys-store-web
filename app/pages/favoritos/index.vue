<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const page = ref(1)
const limit = 12

const {
  data: favoritesPage,
  isPending,
  isError,
  error,
  refetch,
} = useStoreFavoritesQuery(() => ({ page: page.value, limit }))

const { data: favoritesCount } = useStoreFavoritesCountQuery()

useQueryErrorToast(isError, error)

const favorites = computed(() => favoritesPage.value?.items ?? [])
const total = computed(() => favoritesPage.value?.meta.total ?? 0)
const totalPages = computed(() => favoritesPage.value?.meta.totalPages ?? 1)

useStoreSeo({
  title: 'Mis favoritos',
  noindex: true,
})
</script>

<template>
  <section class="mx-auto max-w-7xl px-4 py-8 sm:py-12">
    <UiPageHeader
      title="Mis favoritos"
      :description="
        total > 0
          ? `${total} producto${total === 1 ? '' : 's'} guardado${total === 1 ? '' : 's'} para después`
          : 'Guarda productos que te interesen y vuelve cuando quieras comprarlos.'
      "
      :breadcrumb="[
        { label: 'Inicio', to: '/' },
        { label: 'Mis favoritos' },
      ]"
    />

    <div
      v-if="isPending"
      class="grid gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4"
    >
      <StoreProductCardSkeleton
        v-for="index in 8"
        :key="index"
      />
    </div>

    <UiErrorState
      v-else-if="isError"
      title="No pudimos cargar tus favoritos"
      @retry="refetch()"
    />

    <UiEmptyState
      v-else-if="favorites.length === 0"
      icon="lucide:heart"
      title="Tu lista está vacía"
      description="Toca el corazón en cualquier producto del catálogo para guardarlo aquí."
    >
      <template #action>
        <NuxtLink to="/productos">
          <UiButton icon="lucide:layout-grid">Explorar catálogo</UiButton>
        </NuxtLink>
      </template>
    </UiEmptyState>

    <template v-else>
      <div class="border-theme bg-theme-muted/40 mb-6 flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-sm">
        <p class="text-theme">
          <span class="font-semibold">{{ favoritesCount ?? total }}</span>
          <span class="text-theme-muted"> en tu lista</span>
        </p>
        <NuxtLink
          to="/productos"
          class="text-brand-accent-deep font-medium hover:underline"
        >
          Seguir explorando →
        </NuxtLink>
      </div>

      <div class="grid gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
        <StoreFavoriteProductCard
          v-for="item in favorites"
          :key="item.id"
          :product="item.product"
        />
      </div>

      <UiPagination
        v-if="totalPages > 1"
        class="mt-8"
        :page="page"
        :page-size="limit"
        :total="total"
        tone="store"
        @update:page="page = $event"
      />
    </template>
  </section>
</template>
