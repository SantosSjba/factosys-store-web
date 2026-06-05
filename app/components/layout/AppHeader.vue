<script setup lang="ts">
const config = useRuntimeConfig()
const route = useRoute()
const authStore = useAuthStore()

const searchQuery = ref('')
const isMenuOpen = ref(false)
const isAccountOpen = ref(false)
const cartCount = useState('store-cart-count', () => 0)

const greetingName = computed(() => {
  if (!authStore.isAuthenticated || !authStore.user) {
    return null
  }
  const parts = [authStore.user.firstName, authStore.user.lastName].filter(Boolean)
  return parts.length > 0 ? parts.join(' ') : authStore.user.email.split('@')[0]
})

const accountLabel = computed(() =>
  greetingName.value ? `Hola, ${greetingName.value}` : 'Hola, Inicia sesión',
)

const subnavLinks = [
  { label: 'Ofertas del día', to: '/' },
  { label: 'Vende en Factosys', to: '#' },
  { label: 'Venta telefónica', to: '#' },
  { label: 'Ayuda', to: '#' },
]

function closePanels() {
  isMenuOpen.value = false
  isAccountOpen.value = false
}

function onSearchSubmit() {
  if (!searchQuery.value.trim()) return
}

async function handleLogout() {
  isAccountOpen.value = false
  await authStore.logout()
  await navigateTo('/')
}

watch(
  () => route.path,
  () => closePanels(),
)
</script>

<template>
  <header class="bg-theme-header sticky top-0 z-40 shadow-sm">
    <!-- Franja promocional -->
    <div
      class="border-store-promo-bar bg-store-promo-bar text-store-promo-bar border-b text-center text-xs font-medium sm:text-sm"
    >
      <div class="mx-auto max-w-7xl px-4 py-2">
        <p class="truncate">
          Envío gratis en compras seleccionadas ·
          <NuxtLink to="/" class="underline hover:no-underline">Ver ofertas</NuxtLink>
          <span class="mx-2 hidden sm:inline">|</span>
          <NuxtLink to="/intranet" class="hidden underline hover:no-underline sm:inline">
            Acceso intranet
          </NuxtLink>
        </p>
      </div>
    </div>

    <!-- Fila principal -->
    <div class="border-theme border-b">
      <div
        class="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:gap-4 sm:py-4 lg:gap-6"
      >
        <BrandLogo />

        <button
          type="button"
          class="text-theme hover:bg-theme-muted hidden shrink-0 items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium lg:flex"
          :aria-expanded="isMenuOpen"
          @click="isMenuOpen = !isMenuOpen"
        >
          <UiIcon name="lucide:menu" :size="20" />
          Menú
        </button>

        <form
          class="flex min-w-0 flex-1 items-center"
          role="search"
          @submit.prevent="onSearchSubmit"
        >
          <UiSearchInput
            v-model="searchQuery"
            :placeholder="`Buscar en ${config.public.appName}`"
            @submit="onSearchSubmit"
          />
        </form>

        <div class="flex shrink-0 items-center gap-1 sm:gap-2">
          <ThemeToggle />

          <div class="relative hidden sm:block">
            <button
              type="button"
              class="text-theme hover:bg-theme-muted flex items-center gap-1 rounded-lg px-2 py-1.5 text-left text-sm"
              :aria-expanded="isAccountOpen"
              @click="isAccountOpen = !isAccountOpen"
            >
              <span class="max-w-[9rem] truncate font-medium">{{ accountLabel }}</span>
              <UiIcon name="lucide:chevron-down" :size="16" class="text-theme-muted shrink-0" />
            </button>

            <div
              v-if="isAccountOpen"
              class="border-theme bg-theme-dropdown absolute right-0 top-full z-50 mt-1 w-48 rounded-lg border py-1 shadow-lg"
            >
              <template v-if="authStore.isAuthenticated">
                <NuxtLink
                  to="/cuenta"
                  class="text-theme hover:bg-theme-muted block px-4 py-2 text-sm"
                  @click="isAccountOpen = false"
                >
                  Mi cuenta
                </NuxtLink>
                <button
                  type="button"
                  class="text-theme hover:bg-theme-muted block w-full px-4 py-2 text-left text-sm"
                  @click="handleLogout"
                >
                  Cerrar sesión
                </button>
              </template>
              <template v-else>
                <NuxtLink
                  to="/login"
                  class="text-theme hover:bg-theme-muted block px-4 py-2 text-sm"
                  @click="isAccountOpen = false"
                >
                  Iniciar sesión
                </NuxtLink>
                <NuxtLink
                  to="/registro"
                  class="text-theme hover:bg-theme-muted block px-4 py-2 text-sm"
                  @click="isAccountOpen = false"
                >
                  Crear cuenta
                </NuxtLink>
              </template>
            </div>
          </div>

          <NuxtLink
            to="/cuenta"
            class="text-theme hover:bg-theme-muted hidden rounded-lg px-2 py-1.5 text-sm font-medium md:inline"
          >
            Mi cuenta
          </NuxtLink>

          <UiIconButton icon="lucide:heart" ariaLabel="Favoritos" size="lg" />

          <UiIconButton
            icon="lucide:shopping-cart"
            ariaLabel="Carrito de compras"
            size="lg"
            :badge="cartCount"
          />

          <UiIconButton
            icon="lucide:menu"
            ariaLabel="Abrir menú"
            size="lg"
            class="lg:hidden"
            @click="isMenuOpen = !isMenuOpen"
          />
        </div>
      </div>
    </div>

    <!-- Subnavegación -->
    <div class="bg-store-subnav border-store-line hidden border-b sm:block">
      <div
        class="text-theme mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 text-sm"
      >
        <button
          type="button"
          class="hover:text-brand-accent flex items-center gap-1.5 font-medium"
        >
          <UiIcon name="lucide:map-pin" :size="16" />
          Ingresa tu ubicación
        </button>

        <nav class="flex flex-wrap items-center justify-end gap-4 lg:gap-6">
          <NuxtLink
            v-for="link in subnavLinks"
            :key="link.label"
            :to="link.to"
            class="hover:text-brand-accent whitespace-nowrap hover:underline"
          >
            {{ link.label }}
          </NuxtLink>
        </nav>
      </div>
    </div>

    <!-- Panel menú lateral (shell) -->
    <Teleport to="body">
      <div
        v-if="isMenuOpen"
        class="fixed inset-0 z-50 lg:hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Menú de categorías"
      >
        <button
          type="button"
          class="absolute inset-0 bg-black/40"
          aria-label="Cerrar menú"
          @click="isMenuOpen = false"
        />
        <aside
          class="bg-theme-surface absolute left-0 top-0 flex h-full w-[min(20rem,85vw)] flex-col shadow-xl"
        >
          <div class="border-theme flex items-center justify-between border-b px-4 py-4">
            <span class="text-theme font-semibold">Categorías</span>
            <UiIconButton
              icon="lucide:x"
              ariaLabel="Cerrar"
              @click="isMenuOpen = false"
            />
          </div>
          <nav class="text-theme flex-1 overflow-y-auto p-4 text-sm">
            <p class="text-theme-muted mb-3 text-xs font-semibold uppercase tracking-wide">
              Próximamente
            </p>
            <ul class="space-y-1">
              <li
                v-for="category in ['Tecnología', 'Hogar', 'Moda', 'Deportes', 'Ofertas']"
                :key="category"
              >
                <button
                  type="button"
                  class="hover:bg-theme-muted w-full rounded-lg px-3 py-2.5 text-left"
                >
                  {{ category }}
                </button>
              </li>
            </ul>
            <div class="border-theme mt-6 border-t pt-4 sm:hidden">
              <NuxtLink
                v-if="!authStore.isAuthenticated"
                to="/login"
                class="hover:bg-theme-muted block rounded-lg px-3 py-2"
                @click="isMenuOpen = false"
              >
                Iniciar sesión
              </NuxtLink>
              <NuxtLink
                v-else
                to="/cuenta"
                class="hover:bg-theme-muted block rounded-lg px-3 py-2"
                @click="isMenuOpen = false"
              >
                Mi cuenta
              </NuxtLink>
            </div>
          </nav>
        </aside>
      </div>
    </Teleport>

    <div
      v-if="isAccountOpen"
      class="fixed inset-0 z-30 hidden sm:block"
      @click="isAccountOpen = false"
    />
  </header>
</template>
