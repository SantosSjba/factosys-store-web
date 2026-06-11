<script setup lang="ts">
import type { OrderStatus } from '~/types/admin-orders'

type OrderFilter = 'all' | 'active' | 'delivered'

const page = ref(1)
const limit = 6
const filter = ref<OrderFilter>('all')

const queryParams = computed(() => {
  if (filter.value === 'delivered') {
    return { page: page.value, limit, status: 'DELIVERED' as const }
  }
  if (filter.value === 'active') {
    return { page: page.value, limit, activeOnly: true }
  }
  return { page: page.value, limit }
})

const {
  data: ordersPage,
  isPending,
  isError,
  error,
  refetch,
} = useStoreOrdersQuery(queryParams)

useQueryErrorToast(isError, error)

watch(filter, () => {
  page.value = 1
})

const orders = computed(() => ordersPage.value?.items ?? [])
const totalOrders = computed(() => ordersPage.value?.meta.total ?? 0)
const totalPages = computed(() => ordersPage.value?.meta.totalPages ?? 1)

const filters: Array<{ id: OrderFilter; label: string }> = [
  { id: 'all', label: 'Todos' },
  { id: 'active', label: 'En curso' },
  { id: 'delivered', label: 'Entregados' },
]
</script>

<template>
  <section class="space-y-5">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h3 class="text-theme text-lg font-bold sm:text-xl">
          Últimas compras
          <span v-if="totalOrders > 0" class="text-theme-muted font-medium">
            ({{ totalOrders }})
          </span>
        </h3>
        <p class="text-theme-muted mt-1 text-sm">
          Sigue el estado de tus pedidos y revisa el detalle de cada compra.
        </p>
      </div>

      <div class="flex flex-wrap gap-2">
        <button
          v-for="item in filters"
          :key="item.id"
          type="button"
          class="rounded-full px-3 py-1.5 text-xs font-medium transition sm:text-sm"
          :class="
            filter === item.id
              ? 'bg-brand-accent text-white shadow-sm'
              : 'bg-theme-muted text-theme-muted hover:text-theme'
          "
          @click="filter = item.id"
        >
          {{ item.label }}
        </button>
      </div>
    </div>

    <div
      v-if="isPending"
      class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      <div
        v-for="index in 3"
        :key="index"
        class="border-theme bg-theme-surface rounded-2xl border p-4"
      >
        <UiSkeleton tone="store" height="180px" class="rounded-xl" />
        <UiSkeleton tone="store" height="1rem" width="80%" class="mt-4" />
        <UiSkeleton tone="store" height="0.75rem" width="60%" class="mt-2" />
      </div>
    </div>

    <UiErrorState
      v-else-if="isError"
      title="No pudimos cargar tus pedidos"
      @retry="refetch()"
    />

    <UiEmptyState
      v-else-if="orders.length === 0"
      icon="lucide:shopping-bag"
      :title="filter === 'all' ? 'Aún no tienes compras' : 'No hay pedidos en este filtro'"
      :description="
        filter === 'all'
          ? 'Cuando realices tu primer pedido, aparecerá aquí con su estado y detalle.'
          : 'Prueba con otro filtro o realiza una nueva compra.'
      "
    >
      <template #action>
        <NuxtLink to="/productos">
          <UiButton>Explorar catálogo</UiButton>
        </NuxtLink>
      </template>
    </UiEmptyState>

    <template v-else>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StoreAccountOrderCard
          v-for="order in orders"
          :key="order.id"
          :order="order"
        />
      </div>

      <UiPagination
        v-if="totalPages > 1"
        :page="page"
        :page-size="limit"
        :total="totalOrders"
        tone="store"
        @update:page="page = $event"
      />
    </template>
  </section>
</template>
