<script setup lang="ts">
import type { AuthUser } from '~/types/auth'

const route = useRoute()
const authStore = useAuthStore()
const toast = useToast()

const { data: settings } = useStoreSettingsQuery()
const { data: categories, isPending: categoriesLoading } = useStoreCategoriesQuery()

const searchQuery = ref('')
const isMenuOpen = ref(false)
const isAccountOpen = ref(false)
const { data: favoritesCount } = useStoreFavoritesCountQuery()
const { data: cartCount } = useStoreCartCountQuery()

const accountMenuRef = ref<HTMLElement | null>(null)

const bodyScrollLocked = import.meta.client
  ? useScrollLock(document.body)
  : ref(false)

const storeName = computed(
  () => settings.value?.storeName ?? useRuntimeConfig().public.appName,
)

const promoMessage = computed(() => {
  const parts: string[] = []
  const minDays = settings.value?.handlingDaysMin
  const maxDays = settings.value?.handlingDaysMax
  if (minDays != null && maxDays != null) {
    parts.push(`Despacho en ${minDays}–${maxDays} días hábiles`)
  }
  const min = settings.value?.freeShippingMinAmount
  if (min && Number.parseFloat(min) > 0) {
    const symbol = settings.value?.currency.symbol ?? 'S/'
    parts.push(`envío gratis desde ${symbol} ${min}`)
  }
  if (parts.length > 0) {
    const first = parts[0] ?? ''
    const second = parts[1]
    const lead = first ? `${first.charAt(0).toUpperCase()}${first.slice(1)}` : ''
    return second ? `${lead} · ${second}` : lead
  }
  return 'Envíos a Lima y provincias · Compra segura'
})

const supportHref = computed(() => {
  const email = settings.value?.company.supportEmail
  if (email) return `mailto:${email}`
  const phone = settings.value?.company.supportPhone
  if (phone) return `tel:${phone.replace(/\s/g, '')}`
  return '/productos'
})

const authUserState = useState<AuthUser | null>('store-auth-user')

const greetingName = computed(() => {
  const currentUser = authStore.user ?? authUserState.value
  if (!currentUser || !authStore.isAuthenticated) return null
  const parts = [currentUser.firstName, currentUser.lastName].filter(Boolean)
  return parts.length > 0 ? parts.join(' ') : currentUser.email.split('@')[0]
})

const accountLabel = computed(() =>
  greetingName.value ? `Hola, ${greetingName.value}` : 'Hola, Inicia sesión',
)

const favoritesBadge = computed(() => {
  const count = favoritesCount.value
  return count != null && count > 0 ? count : undefined
})

const cartBadge = computed(() => {
  const count = cartCount.value
  return count != null && count > 0 ? count : undefined
})

const activeCategorySlug = computed(() =>
  route.path === '/productos' && typeof route.query.categoria === 'string'
    ? route.query.categoria
    : undefined,
)

const subnavLinks = computed(() => [
  { label: 'Ofertas del día', to: '/#ofertas' },
  { label: 'Catálogo', to: '/productos' },
  {
    label: 'Ayuda',
    to: supportHref.value,
    external: supportHref.value.startsWith('http') || supportHref.value.startsWith('mailto:') || supportHref.value.startsWith('tel:'),
  },
])

function closePanels() {
  isMenuOpen.value = false
  isAccountOpen.value = false
}

function onSearchSubmit() {
  const query = searchQuery.value.trim()
  if (!query) return
  closePanels()
  navigateTo({ path: '/productos', query: { q: query } })
}

async function onFavoritesClick() {
  closePanels()
  if (authStore.isAuthenticated) {
    await navigateTo('/favoritos')
    return
  }
  await navigateTo({ path: '/login', query: { redirect: '/favoritos' } })
}

async function onCartClick() {
  closePanels()
  if (authStore.isAuthenticated) {
    await navigateTo('/carrito')
    return
  }
  await navigateTo({ path: '/login', query: { redirect: '/carrito' } })
}

async function handleLogout() {
  isAccountOpen.value = false
  await authStore.logout()
  await navigateTo('/')
}

watch(isMenuOpen, (open) => {
  bodyScrollLocked.value = open
})

onKeyStroke('Escape', () => {
  if (isMenuOpen.value || isAccountOpen.value) closePanels()
})

onClickOutside(accountMenuRef, () => {
  isAccountOpen.value = false
})

watch(() => route.path, () => closePanels())

function readSearchQueryParam(value: unknown): string {
  if (typeof value === 'string') return value
  if (Array.isArray(value) && typeof value[0] === 'string') return value[0]
  return ''
}

watch(
  () => route.query.q,
  (value) => {
    searchQuery.value = readSearchQueryParam(value)
  },
  { immediate: true },
)
</script>

<template>
  <header class="bg-theme-header sticky top-0 z-40 shadow-sm">
    <div
      class="border-store-promo-bar bg-store-promo-bar text-store-promo-bar border-b text-center text-xs font-medium sm:text-sm"
    >
      <div class="mx-auto max-w-7xl px-4 py-2">
        <p class="truncate sm:whitespace-normal">
          {{ promoMessage }} ·
          <NuxtLink to="/productos" class="underline hover:no-underline">Ver ofertas</NuxtLink>
        </p>
      </div>
    </div>

    <div class="border-theme border-b">
      <div
        class="mx-auto flex max-w-7xl flex-col gap-3 px-3 py-3 sm:flex-row sm:items-center sm:gap-4 sm:px-4 sm:py-4 lg:gap-6"
      >
        <div class="flex w-full items-center gap-2 sm:contents">
          <BrandLogo responsive />

          <button
            type="button"
            class="text-theme hover:bg-theme-muted hidden shrink-0 items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium lg:flex"
            :aria-expanded="isMenuOpen"
            aria-controls="store-category-menu"
            @click="isMenuOpen = !isMenuOpen"
          >
            <UiIcon name="lucide:menu" :size="20" />
            Menú
          </button>

          <div class="ml-auto flex shrink-0 items-center gap-0.5 sm:ml-0 sm:gap-1">
            <ThemeToggle class="hidden sm:inline-flex" />

            <div ref="accountMenuRef" class="relative hidden sm:block">
              <button
                type="button"
                class="text-theme hover:bg-theme-muted flex max-w-[10rem] items-center gap-1 rounded-lg px-2 py-1.5 text-left text-sm lg:max-w-[11rem]"
                :aria-expanded="isAccountOpen"
                aria-haspopup="true"
                @click="isAccountOpen = !isAccountOpen"
              >
                <span class="truncate font-medium">{{ accountLabel }}</span>
                <UiIcon name="lucide:chevron-down" :size="16" class="text-theme-muted shrink-0" />
              </button>

              <div
                v-if="isAccountOpen"
                class="border-theme bg-theme-dropdown absolute right-0 top-full z-50 mt-1 w-48 rounded-lg border py-1 shadow-lg"
                role="menu"
              >
                <template v-if="authStore.isAuthenticated">
                  <NuxtLink
                    to="/cuenta"
                    class="text-theme hover:bg-theme-muted flex items-center gap-2 px-4 py-2 text-sm"
                    role="menuitem"
                    @click="isAccountOpen = false"
                  >
                    <UiIcon name="lucide:user" :size="16" class="text-theme-muted shrink-0" />
                    Mi cuenta
                  </NuxtLink>
                  <NuxtLink
                    to="/carrito"
                    class="text-theme hover:bg-theme-muted flex items-center gap-2 px-4 py-2 text-sm"
                    role="menuitem"
                    @click="isAccountOpen = false"
                  >
                    <UiIcon name="lucide:shopping-cart" :size="16" class="text-theme-muted shrink-0" />
                    Mi carrito
                  </NuxtLink>
                  <NuxtLink
                    to="/favoritos"
                    class="text-theme hover:bg-theme-muted flex items-center gap-2 px-4 py-2 text-sm"
                    role="menuitem"
                    @click="isAccountOpen = false"
                  >
                    <UiIcon name="lucide:heart" :size="16" class="text-theme-muted shrink-0" />
                    Mis favoritos
                  </NuxtLink>
                  <button
                    type="button"
                    class="text-theme hover:bg-theme-muted flex w-full items-center gap-2 px-4 py-2 text-left text-sm"
                    role="menuitem"
                    @click="handleLogout"
                  >
                    <UiIcon name="lucide:log-out" :size="16" class="text-theme-muted shrink-0" />
                    Cerrar sesión
                  </button>
                </template>
                <template v-else>
                  <NuxtLink
                    to="/login"
                    class="text-theme hover:bg-theme-muted flex items-center gap-2 px-4 py-2 text-sm"
                    role="menuitem"
                    @click="isAccountOpen = false"
                  >
                    <UiIcon name="lucide:log-in" :size="16" class="text-theme-muted shrink-0" />
                    Iniciar sesión
                  </NuxtLink>
                  <NuxtLink
                    to="/registro"
                    class="text-theme hover:bg-theme-muted flex items-center gap-2 px-4 py-2 text-sm"
                    role="menuitem"
                    @click="isAccountOpen = false"
                  >
                    <UiIcon name="lucide:user-plus" :size="16" class="text-theme-muted shrink-0" />
                    Crear cuenta
                  </NuxtLink>
                </template>
              </div>
            </div>

            <NuxtLink
              to="/cuenta"
              class="text-theme hover:bg-theme-muted hidden items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium md:inline-flex"
            >
              <UiIcon name="lucide:user" :size="16" class="text-theme-muted" />
              Mi cuenta
            </NuxtLink>

            <UiIconButton
              icon="lucide:heart"
              ariaLabel="Mis favoritos"
              size="lg"
              :badge="favoritesBadge"
              @click="onFavoritesClick"
            />

            <UiIconButton
              icon="lucide:shopping-cart"
              ariaLabel="Carrito de compras"
              size="lg"
              :badge="cartBadge"
              @click="onCartClick"
            />

            <UiIconButton
              icon="lucide:menu"
              ariaLabel="Abrir menú de categorías"
              size="lg"
              class="lg:hidden"
              :aria-expanded="isMenuOpen"
              aria-controls="store-category-menu"
              @click="isMenuOpen = !isMenuOpen"
            />
          </div>
        </div>

        <form
          class="w-full sm:min-w-0 sm:flex-1"
          role="search"
          @submit.prevent="onSearchSubmit"
        >
          <UiSearchInput
            v-model="searchQuery"
            placeholder="Buscar productos…"
            :aria-label="`Buscar productos en ${storeName}`"
            @submit="onSearchSubmit"
          />
        </form>
      </div>
    </div>

    <div class="bg-store-subnav border-store-line hidden border-b sm:block">
      <div
        class="text-theme mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 text-sm"
      >
        <button
          type="button"
          class="hover:text-brand-accent flex items-center gap-1.5 font-medium"
          aria-controls="store-category-menu"
          :aria-expanded="isMenuOpen"
          @click="isMenuOpen = true"
        >
          <UiIcon name="lucide:layout-grid" :size="16" />
          Categorías
        </button>

        <nav class="flex flex-wrap items-center justify-end gap-4 lg:gap-6" aria-label="Enlaces rápidos">
          <template v-for="link in subnavLinks" :key="link.label">
            <a
              v-if="link.external"
              :href="link.to"
              class="hover:text-brand-accent whitespace-nowrap hover:underline"
            >
              {{ link.label }}
            </a>
            <NuxtLink
              v-else
              :to="link.to"
              class="hover:text-brand-accent whitespace-nowrap hover:underline"
            >
              {{ link.label }}
            </NuxtLink>
          </template>
        </nav>
      </div>
    </div>

    <Teleport to="body">
      <div
        v-if="isMenuOpen"
        class="fixed inset-0 z-50"
        role="dialog"
        aria-modal="true"
        aria-label="Menú de categorías"
      >
        <button
          type="button"
          class="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
          aria-label="Cerrar menú"
          @click="isMenuOpen = false"
        />
        <aside
          id="store-category-menu"
          class="bg-theme-surface absolute left-0 top-0 flex h-full w-[min(20rem,88vw)] flex-col shadow-xl lg:w-[min(24rem,90vw)]"
        >
          <div class="border-theme flex items-center justify-between border-b px-4 py-4">
            <span class="text-theme font-semibold">Categorías</span>
            <UiIconButton
              icon="lucide:x"
              ariaLabel="Cerrar menú"
              @click="isMenuOpen = false"
            />
          </div>
          <nav class="text-theme flex-1 overflow-y-auto p-4 text-sm" aria-label="Categorías de productos">
            <div v-if="categoriesLoading" class="space-y-2">
              <UiSkeleton
                v-for="index in 6"
                :key="index"
                tone="store"
                height="2.5rem"
                rounded="lg"
              />
            </div>
            <StoreCategoryMenu
              v-else-if="categories?.length"
              :categories="categories"
              :active-slug="activeCategorySlug"
              :on-navigate="closePanels"
            />
            <p v-else class="text-theme-muted text-sm">
              No hay categorías disponibles.
            </p>
            <div class="border-theme mt-6 space-y-1 border-t pt-4 sm:hidden">
              <NuxtLink
                v-if="!authStore.isAuthenticated"
                to="/login"
                class="hover:bg-theme-muted flex items-center gap-2 rounded-lg px-3 py-2.5"
                @click="isMenuOpen = false"
              >
                <UiIcon name="lucide:log-in" :size="16" class="text-theme-muted shrink-0" />
                Iniciar sesión
              </NuxtLink>
              <template v-else>
                <NuxtLink
                  to="/cuenta"
                  class="hover:bg-theme-muted flex items-center gap-2 rounded-lg px-3 py-2.5"
                  @click="isMenuOpen = false"
                >
                  <UiIcon name="lucide:user" :size="16" class="text-theme-muted shrink-0" />
                  Mi cuenta
                </NuxtLink>
                <NuxtLink
                  to="/favoritos"
                  class="hover:bg-theme-muted flex items-center gap-2 rounded-lg px-3 py-2.5"
                  @click="isMenuOpen = false"
                >
                  <UiIcon name="lucide:heart" :size="16" class="text-theme-muted shrink-0" />
                  Mis favoritos
                </NuxtLink>
                <button
                  type="button"
                  class="text-theme hover:bg-theme-muted flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left"
                  @click="handleLogout"
                >
                  <UiIcon name="lucide:log-out" :size="16" class="text-theme-muted shrink-0" />
                  Cerrar sesión
                </button>
              </template>
            </div>
          </nav>
        </aside>
      </div>
    </Teleport>
  </header>
</template>
