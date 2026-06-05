<script setup lang="ts">
const route = useRoute()
const { toggle } = useAdminSidebar()

const pageTitle = computed(() => {
  const meta = route.meta.adminTitle
  return typeof meta === 'string' ? meta : 'Panel'
})
</script>

<template>
  <header
    class="border-admin-line sticky top-0 z-20 flex h-16 shrink-0 items-center gap-4 border-b bg-white px-4 lg:px-6"
  >
    <button
      type="button"
      class="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
      aria-label="Abrir menú"
      @click="toggle"
    >
      <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" d="M4 7h16M4 12h16M4 17h16" />
      </svg>
    </button>

    <div class="hidden min-w-0 shrink-0 lg:block">
      <p class="text-sm font-semibold text-slate-900">{{ pageTitle }}</p>
    </div>

    <AdminHeaderSearch />

    <div class="ml-auto flex items-center gap-2">
      <NuxtLink
        to="/"
        class="hidden rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 sm:inline"
      >
        Tienda
      </NuxtLink>
      <AdminUserMenu />
    </div>
  </header>
</template>
