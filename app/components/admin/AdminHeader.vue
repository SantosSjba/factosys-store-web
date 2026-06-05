<script setup lang="ts">
const route = useRoute()
const { toggle, toggleCollapsed } = useAdminSidebar()

const pageTitle = computed(() => {
  const meta = route.meta.adminTitle
  return typeof meta === 'string' ? meta : 'Panel'
})
</script>

<template>
  <header
    class="border-admin-line bg-admin-card sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 border-b px-4 lg:px-6"
  >
    <button
      type="button"
      class="rounded-lg p-2 text-admin-muted transition hover:bg-admin-surface lg:hidden"
      aria-label="Abrir menú"
      @click="toggle"
    >
      <UiIcon name="lucide:menu" :size="20" />
    </button>

    <button
      type="button"
      class="text-admin-muted hidden rounded-lg p-2 transition hover:bg-admin-surface lg:inline-flex"
      aria-label="Minimizar o expandir menú lateral"
      @click="toggleCollapsed"
    >
      <UiIcon name="lucide:menu" :size="20" />
    </button>

    <div class="hidden min-w-0 shrink-0 lg:block">
      <p class="text-admin text-sm font-semibold">{{ pageTitle }}</p>
    </div>

    <AdminHeaderSearch />

    <div class="ml-auto flex items-center gap-1 sm:gap-2">
      <NuxtLink
        to="/"
        class="text-admin-muted hidden rounded-lg px-3 py-2 text-sm transition hover:bg-admin-surface sm:inline"
      >
        Tienda
      </NuxtLink>
      <ThemeToggle />
      <AdminUserMenu />
    </div>
  </header>
</template>
