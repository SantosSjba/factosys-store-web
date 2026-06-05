<script setup lang="ts">
const adminAuth = useAdminAuthStore()
const menuOpen = ref(false)

const initials = computed(() => {
  const name = adminAuth.displayName || adminAuth.user?.email || 'A'
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')
})

async function handleLogout() {
  menuOpen.value = false
  await adminAuth.logout()
  await navigateTo('/intranet/login')
}
</script>

<template>
  <div class="relative">
    <button
      type="button"
      class="border-admin-line flex items-center gap-2 rounded-lg border bg-white py-1.5 pl-1.5 pr-2.5 transition hover:bg-slate-50"
      :aria-expanded="menuOpen"
      @click="menuOpen = !menuOpen"
    >
      <span
        class="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
        style="background: var(--admin-primary)"
      >
        {{ initials }}
      </span>
      <span class="hidden max-w-[8rem] truncate text-sm font-medium text-slate-700 sm:inline">
        {{ adminAuth.displayName || 'Staff' }}
      </span>
      <svg class="h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" d="m6 9 6 6 6-6" />
      </svg>
    </button>

    <div
      v-if="menuOpen"
      class="border-admin-line absolute right-0 top-full z-50 mt-2 w-48 rounded-lg border bg-white py-1 shadow-lg"
    >
      <div class="border-admin-line border-b px-4 py-2">
        <p class="truncate text-sm font-medium text-slate-800">
          {{ adminAuth.displayName }}
        </p>
        <p class="truncate text-xs text-slate-500">{{ adminAuth.user?.email }}</p>
      </div>
      <NuxtLink
        to="/intranet"
        class="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
        @click="menuOpen = false"
      >
        Mi panel
      </NuxtLink>
      <button
        type="button"
        class="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
        @click="handleLogout"
      >
        Cerrar sesión
      </button>
    </div>

    <div v-if="menuOpen" class="fixed inset-0 z-40" @click="menuOpen = false" />
  </div>
</template>
