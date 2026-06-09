<script setup lang="ts">
import { fetchAdminCustomers } from '~/api/admin-customers.api'
import { fetchAdminOrders } from '~/api/admin-orders.api'
import { fetchAdminProducts } from '~/api/admin-catalog.api'

type SearchResult = {
  id: string
  label: string
  meta?: string
  type: 'order' | 'customer' | 'product'
}

const { can } = useAdminPermissions()
const query = ref('')
const results = ref<SearchResult[]>([])
const isSearching = ref(false)
const isOpen = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)

let debounceTimer: ReturnType<typeof setTimeout> | undefined

async function runSearch(term: string) {
  const q = term.trim()
  if (q.length < 2) {
    results.value = []
    isOpen.value = false
    return
  }

  isSearching.value = true
  const collected: SearchResult[] = []

  try {
    const tasks: Promise<void>[] = []

    if (can('orders.read')) {
      tasks.push(
        fetchAdminOrders({ search: q, page: 1, limit: 5 }).then((response) => {
          for (const order of response.items) {
            collected.push({
              id: order.id,
              type: 'order',
              label: order.orderNumber,
              meta: order.customerName || order.customerEmail || undefined,
            })
          }
        }),
      )
    }

    if (can('users.read')) {
      tasks.push(
        fetchAdminCustomers({ search: q, page: 1, limit: 5 }).then((response) => {
          for (const customer of response.items) {
            collected.push({
              id: customer.id,
              type: 'customer',
              label: formatCustomerLabel(customer),
              meta: customer.email,
            })
          }
        }),
      )
    }

    if (can('products.read')) {
      tasks.push(
        fetchAdminProducts({ search: q, page: 1, limit: 5 }).then((response) => {
          for (const product of response.items) {
            collected.push({
              id: product.id,
              type: 'product',
              label: product.name,
              meta: product.slug || undefined,
            })
          }
        }),
      )
    }

    await Promise.all(tasks)
    results.value = collected.slice(0, 12)
    isOpen.value = collected.length > 0
  } finally {
    isSearching.value = false
  }
}

watch(query, (value) => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => runSearch(value), 280)
})

function onSubmit() {
  if (!results.value.length) return
  navigateToResult(results.value[0]!)
}

function navigateToResult(result: SearchResult) {
  isOpen.value = false
  query.value = ''

  if (result.type === 'order') {
    navigateTo({ path: '/intranet/pedidos', query: { orderId: result.id } })
    return
  }
  if (result.type === 'customer') {
    navigateTo({ path: '/intranet/clientes', query: { customerId: result.id } })
    return
  }
  navigateTo({ path: '/intranet/catalogo', query: { productId: result.id } })
}

function typeLabel(type: SearchResult['type']) {
  return { order: 'Pedido', customer: 'Cliente', product: 'Producto' }[type]
}

function onGlobalKeydown(event: KeyboardEvent) {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    inputRef.value?.focus()
  }
  if (event.key === 'Escape') {
    isOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('keydown', onGlobalKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onGlobalKeydown)
  clearTimeout(debounceTimer)
})
</script>

<template>
  <form
    class="relative hidden max-w-md flex-1 md:block"
    role="search"
    @submit.prevent="onSubmit"
  >
    <div class="relative">
      <UiIcon
        name="lucide:search"
        :size="16"
        class="text-admin-muted pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
      />
      <input
        ref="inputRef"
        v-model="query"
        type="search"
        placeholder="Buscar pedidos, clientes, productos…"
        autocomplete="off"
        class="border-admin-line bg-admin-surface text-admin placeholder:text-admin-muted w-full rounded-lg border py-2 pl-10 pr-16 text-sm focus:border-[var(--admin-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--admin-primary)]"
        @focus="isOpen = results.length > 0"
        @blur="setTimeout(() => { isOpen = false }, 150)"
      />
      <kbd
        class="border-admin-line bg-admin-card text-admin-muted pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border px-1.5 py-0.5 text-[10px] sm:inline"
      >
        ⌘K
      </kbd>
    </div>

    <div
      v-if="isOpen && (results.length || isSearching)"
      class="border-admin-line bg-admin-card absolute left-0 right-0 top-full z-50 mt-1 max-h-80 overflow-y-auto rounded-lg border shadow-lg"
    >
      <div v-if="isSearching" class="text-admin-muted flex items-center gap-2 px-3 py-3 text-sm">
        <UiSpinner size="sm" />
        Buscando…
      </div>
      <button
        v-for="result in results"
        :key="`${result.type}-${result.id}`"
        type="button"
        class="hover:bg-admin-muted/40 flex w-full items-start gap-3 px-3 py-2.5 text-left text-sm"
        @mousedown.prevent="navigateToResult(result)"
      >
        <UiBadge variant="default" class="mt-0.5 shrink-0">{{ typeLabel(result.type) }}</UiBadge>
        <div class="min-w-0">
          <p class="truncate font-medium">{{ result.label }}</p>
          <p v-if="result.meta" class="text-admin-muted truncate text-xs">{{ result.meta }}</p>
        </div>
      </button>
    </div>
  </form>
</template>
