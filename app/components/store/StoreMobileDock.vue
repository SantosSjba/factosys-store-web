<script setup lang="ts">
const route = useRoute()
const { data: settings } = useStoreSettingsQuery()

const isStoreRoute = computed(() => !route.path.startsWith('/intranet'))

const whatsappUrl = computed(() => {
  const raw = settings.value?.company.whatsapp
  if (!raw) return null
  const digits = raw.replace(/\D/g, '')
  return digits ? `https://wa.me/${digits}` : null
})

const authStore = useAuthStore()

const items = computed(() => {
  const links = [
    { label: 'Inicio', icon: 'lucide:home', to: '/', external: false },
    { label: 'Ofertas', icon: 'lucide:percent', to: '/#ofertas', external: false },
    { label: 'Catálogo', icon: 'lucide:layout-grid', to: '/productos', external: false },
    { label: 'Favoritos', icon: 'lucide:heart', to: '/favoritos', external: false },
  ]

  if (whatsappUrl.value) {
    links.push({
      label: 'WhatsApp',
      icon: 'lucide:message-circle',
      to: whatsappUrl.value,
      external: true,
    })
  } else if (!authStore.isAuthenticated) {
    links.push({
      label: 'Cuenta',
      icon: 'lucide:user',
      to: '/login',
      external: false,
    })
  }

  return links
})

function isActive(to: string) {
  if (to === '/') return route.path === '/'
  if (to === '/#ofertas') return route.path === '/'
  if (to === '/favoritos') return route.path.startsWith('/favoritos')
  if (to.startsWith('http')) return false
  return route.path.startsWith(to)
}
</script>

<template>
  <nav
    v-if="isStoreRoute"
    class="border-theme bg-theme-surface fixed inset-x-0 bottom-0 z-40 border-t shadow-[0_-4px_20px_rgb(0_0_0/0.06)] md:hidden"
    aria-label="Navegación rápida"
  >
    <div class="mx-auto flex max-w-lg items-stretch justify-around px-1 py-1">
      <template v-for="item in items" :key="item.label">
        <a
          v-if="item.external"
          :href="item.to"
          target="_blank"
          rel="noopener noreferrer"
          class="text-theme-muted flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-lg px-1 py-2 text-[10px] font-medium transition hover:text-[#25D366]"
        >
          <UiIcon :name="item.icon" :size="20" />
          <span class="truncate">{{ item.label }}</span>
        </a>
        <NuxtLink
          v-else
          :to="item.to"
          class="text-theme-muted flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-lg px-1 py-2 text-[10px] font-medium transition"
          :class="isActive(item.to) && 'text-brand-accent'"
        >
          <UiIcon :name="item.icon" :size="20" />
          <span class="truncate">{{ item.label }}</span>
        </NuxtLink>
      </template>
    </div>
  </nav>
</template>
