<script setup lang="ts">
const adminAuth = useAdminAuthStore()
const menuOpen = ref(false)
const showProfile = ref(false)

onMounted(() => {
  showProfile.value = true
})

const initials = computed(() => {
  if (!showProfile.value) return '···'
  const name = adminAuth.displayName || adminAuth.user?.email || 'A'
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')
})

const displayLabel = computed(() =>
  showProfile.value ? adminAuth.displayName || 'Staff' : 'Staff',
)

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
      class="flex items-center gap-2 rounded-lg py-1.5 pl-1.5 pr-2.5 transition hover:bg-admin-surface"
      :aria-expanded="menuOpen"
      @click="menuOpen = !menuOpen"
    >
      <span
        class="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
        style="background: var(--admin-primary)"
      >
        {{ initials }}
      </span>
      <span class="text-admin hidden max-w-[8rem] truncate text-sm font-medium sm:inline">
        {{ displayLabel }}
      </span>
      <UiIcon name="lucide:chevron-down" :size="16" class="text-admin-muted" />
    </button>

    <div
      v-if="menuOpen"
      class="border-admin-line bg-admin-card absolute right-0 top-full z-50 mt-2 w-48 rounded-lg border py-1 shadow-lg"
    >
      <div v-if="showProfile" class="border-admin-line border-b px-4 py-2">
        <p class="text-admin truncate text-sm font-medium">
          {{ adminAuth.displayName }}
        </p>
        <p class="text-admin-muted truncate text-xs">{{ adminAuth.user?.email }}</p>
      </div>
      <NuxtLink
        to="/intranet"
        class="text-admin block px-4 py-2 text-sm hover:bg-admin-surface"
        @click="menuOpen = false"
      >
        Mi panel
      </NuxtLink>
      <button
        type="button"
        class="block w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-500/10"
        @click="handleLogout"
      >
        Cerrar sesión
      </button>
    </div>

    <div v-if="menuOpen" class="fixed inset-0 z-40" @click="menuOpen = false" />
  </div>
</template>
