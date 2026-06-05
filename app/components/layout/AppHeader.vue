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
  // Shell: conectar con catálogo cuando exista el módulo
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
          <NuxtLink to="/" class="underline hover:no-underline">
            Ver ofertas
          </NuxtLink>
          <span class="mx-2 hidden sm:inline">|</span>
          <NuxtLink
            to="/intranet"
            class="hidden underline hover:no-underline sm:inline"
          >
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
        <!-- Logo (texto provisional) -->
        <NuxtLink
          to="/"
          class="flex shrink-0 items-baseline gap-1.5 font-bold tracking-tight sm:gap-2"
        >
          <span class="text-brand-facto text-lg sm:text-xl">FACTO</span>
          <span class="text-brand-sys text-lg sm:text-xl">SYS</span>
          <span
            class="text-brand-accent rounded-md border border-[color-mix(in_srgb,var(--brand-cyan)_35%,white)] bg-brand-accent-soft px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider sm:text-xs"
          >
            Store
          </span>
        </NuxtLink>

        <!-- Menú -->
        <button
          type="button"
          class="hidden shrink-0 items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-slate-800 hover:bg-slate-100 lg:flex"
          :aria-expanded="isMenuOpen"
          @click="isMenuOpen = !isMenuOpen"
        >
          <svg
            class="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.75"
            aria-hidden="true"
          >
            <path stroke-linecap="round" d="M4 7h16M4 12h16M4 17h16" />
          </svg>
          Menú
        </button>

        <!-- Buscador -->
        <form
          class="flex min-w-0 flex-1 items-center"
          role="search"
          @submit.prevent="onSearchSubmit"
        >
          <div
            class="border-brand-cyan-focus border-store-line flex w-full items-center overflow-hidden rounded-full border bg-white shadow-sm"
          >
            <input
              v-model="searchQuery"
              type="search"
              class="min-w-0 flex-1 border-0 bg-transparent px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-0"
              :placeholder="`Buscar en ${config.public.appName}`"
              autocomplete="off"
            />
            <button
              type="submit"
              class="bg-brand-ink-btn flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white transition sm:mr-1"
              aria-label="Buscar"
            >
              <svg
                class="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <path stroke-linecap="round" d="m20 20-3.5-3.5" />
              </svg>
            </button>
          </div>
        </form>

        <!-- Acciones -->
        <div class="flex shrink-0 items-center gap-1 sm:gap-2">
          <ThemeToggle />

          <!-- Cuenta -->
          <div class="relative hidden sm:block">
            <button
              type="button"
              class="flex items-center gap-1 rounded-lg px-2 py-1.5 text-left text-sm text-slate-800 hover:bg-slate-100"
              :aria-expanded="isAccountOpen"
              @click="isAccountOpen = !isAccountOpen"
            >
              <span class="max-w-[9rem] truncate font-medium">{{ accountLabel }}</span>
              <svg
                class="h-4 w-4 shrink-0 text-slate-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                aria-hidden="true"
              >
                <path stroke-linecap="round" d="m6 9 6 6 6-6" />
              </svg>
            </button>

            <div
              v-if="isAccountOpen"
              class="border-theme bg-theme-dropdown absolute right-0 top-full z-50 mt-1 w-48 rounded-lg border py-1 shadow-lg"
            >
              <template v-if="authStore.isAuthenticated">
                <NuxtLink
                  to="/cuenta"
                  class="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  @click="isAccountOpen = false"
                >
                  Mi cuenta
                </NuxtLink>
                <button
                  type="button"
                  class="block w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                  @click="handleLogout"
                >
                  Cerrar sesión
                </button>
              </template>
              <template v-else>
                <NuxtLink
                  to="/login"
                  class="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  @click="isAccountOpen = false"
                >
                  Iniciar sesión
                </NuxtLink>
                <NuxtLink
                  to="/registro"
                  class="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  @click="isAccountOpen = false"
                >
                  Crear cuenta
                </NuxtLink>
              </template>
            </div>
          </div>

          <NuxtLink
            to="/cuenta"
            class="hidden rounded-lg px-2 py-1.5 text-sm font-medium text-slate-800 hover:bg-slate-100 md:inline"
          >
            Mi cuenta
          </NuxtLink>

          <!-- Favoritos (shell) -->
          <button
            type="button"
            class="rounded-lg p-2 text-slate-700 hover:bg-slate-100"
            aria-label="Favoritos"
          >
            <svg
              class="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.75"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 21s-7-4.35-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.65-7 10-7 10Z"
              />
            </svg>
          </button>

          <!-- Carrito (shell) -->
          <button
            type="button"
            class="relative rounded-lg p-2 text-slate-700 hover:bg-slate-100"
            aria-label="Carrito de compras"
          >
            <svg
              class="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.75"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 6h15l-1.5 9H8L6 6ZM6 6 5 3H2"
              />
              <circle cx="9" cy="20" r="1" />
              <circle cx="18" cy="20" r="1" />
            </svg>
            <span
              class="bg-brand-accent absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white"
            >
              {{ cartCount }}
            </span>
          </button>

          <!-- Menú móvil -->
          <button
            type="button"
            class="rounded-lg p-2 text-slate-700 hover:bg-slate-100 lg:hidden"
            aria-label="Abrir menú"
            @click="isMenuOpen = !isMenuOpen"
          >
            <svg
              class="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.75"
              aria-hidden="true"
            >
              <path stroke-linecap="round" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Subnavegación -->
    <div class="bg-store-subnav border-store-line hidden border-b sm:block">
      <div
        class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 text-sm text-slate-700"
      >
        <button
          type="button"
          class="hover:text-brand-accent flex items-center gap-1.5 font-medium"
        >
          <svg
            class="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.75"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 21s-6-4.5-6-10a6 6 0 1 1 12 0c0 5.5-6 10-6 10Z"
            />
            <circle cx="12" cy="11" r="2.5" />
          </svg>
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
          <div
            class="flex items-center justify-between border-b border-slate-200 px-4 py-4"
          >
            <span class="font-semibold text-slate-900">Categorías</span>
            <button
              type="button"
              class="rounded-lg p-1 hover:bg-slate-100"
              aria-label="Cerrar"
              @click="isMenuOpen = false"
            >
              <svg
                class="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path stroke-linecap="round" d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </div>
          <nav class="flex-1 overflow-y-auto p-4 text-sm text-slate-700">
            <p class="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Próximamente
            </p>
            <ul class="space-y-1">
              <li
                v-for="category in ['Tecnología', 'Hogar', 'Moda', 'Deportes', 'Ofertas']"
                :key="category"
              >
                <button
                  type="button"
                  class="w-full rounded-lg px-3 py-2.5 text-left hover:bg-slate-100"
                >
                  {{ category }}
                </button>
              </li>
            </ul>
            <div class="mt-6 border-t border-slate-100 pt-4 sm:hidden">
              <NuxtLink
                v-if="!authStore.isAuthenticated"
                to="/login"
                class="block rounded-lg px-3 py-2 hover:bg-slate-100"
                @click="isMenuOpen = false"
              >
                Iniciar sesión
              </NuxtLink>
              <NuxtLink
                v-else
                to="/cuenta"
                class="block rounded-lg px-3 py-2 hover:bg-slate-100"
                @click="isMenuOpen = false"
              >
                Mi cuenta
              </NuxtLink>
            </div>
          </nav>
        </aside>
      </div>
    </Teleport>

    <!-- Cerrar dropdown cuenta al clic fuera -->
    <div
      v-if="isAccountOpen"
      class="fixed inset-0 z-30 hidden sm:block"
      @click="isAccountOpen = false"
    />
  </header>
</template>
