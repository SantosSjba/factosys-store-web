<script setup lang="ts">
import type { DashboardRecentOrder } from '~/types/admin-dashboard'
import {
  formatDeliveryMethod,
  formatOrderStatus,
} from '~/utils/format-order'

definePageMeta({
  layout: 'intranet',
  middleware: 'admin-auth',
  adminTitle: 'Dashboard',
})

const adminAuth = useAdminAuthStore()
const { data: profile, isPending: profilePending } = useAdminProfileQuery()
const { data: stats, isPending: statsPending } = useAdminDashboardQuery()
const isMounted = ref(false)

onMounted(() => {
  isMounted.value = true
})

const permissionsCount = computed(() => profile.value?.permissions.length ?? '—')
const rolesLabel = computed(() => formatRoleNames(profile.value?.roles))
const displayName = computed(() =>
  profile.value ? formatUserName(profile.value) : '',
)
const welcomeName = computed(() =>
  isMounted.value ? adminAuth.displayName || 'usuario staff' : 'usuario staff',
)

const trendLabel = computed(() => {
  if (!stats.value) return undefined
  const value = stats.value.ordersTrendPercent
  const sign = value > 0 ? '+' : ''
  return `${sign}${value}% vs ayer`
})

const trendUp = computed(() => (stats.value?.ordersTrendPercent ?? 0) >= 0)

function openOrder(order: DashboardRecentOrder) {
  navigateTo({ path: '/intranet/pedidos', query: { orderId: order.id } })
}
</script>

<template>
  <div>
    <AdminPageTitle
      title="Dashboard"
      :description="`Bienvenido, ${welcomeName}. Vista general del panel admin.`"
    />

    <div v-if="statsPending && !stats" class="text-admin-muted mb-6 flex items-center gap-2 text-sm">
      <UiSpinner size="sm" />
      Cargando métricas…
    </div>

    <div v-else-if="stats" class="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <AdminStatCard
        label="Pedidos hoy"
        :value="String(stats.ordersToday)"
        :hint="`${stats.ordersYesterday} ayer`"
        icon="orders"
        :trend="trendLabel"
        :trend-up="trendUp"
      />
      <AdminStatCard
        label="Ventas hoy"
        :value="formatPrice(stats.revenueToday, stats.currencyCode)"
        :hint="`${stats.pendingPaymentOrders} pendientes de pago`"
        icon="catalog"
      />
      <AdminStatCard
        label="En proceso"
        :value="String(stats.processingOrders)"
        :hint="`${stats.lowStockItems} productos con stock bajo`"
        icon="inventory"
      />
      <AdminStatCard
        label="Productos activos"
        :value="String(stats.productsActive)"
        :hint="`${stats.staffUsers} usuarios staff`"
        icon="users"
      />
    </div>

    <div v-if="stats" class="mb-6 grid gap-4 lg:grid-cols-3">
      <AdminCard title="Pedidos recientes" class="lg:col-span-2">
        <div v-if="!stats.recentOrders.length" class="text-admin-muted text-sm">
          Aún no hay pedidos registrados.
        </div>
        <div v-else class="divide-admin-line divide-y">
          <button
            v-for="order in stats.recentOrders"
            :key="order.id"
            type="button"
            class="hover:bg-admin-muted/30 flex w-full items-center justify-between gap-3 px-1 py-3 text-left transition"
            @click="openOrder(order)"
          >
            <div class="min-w-0">
              <p class="font-medium">{{ order.orderNumber }}</p>
              <p class="text-admin-muted truncate text-xs">
                {{ order.customerName || order.customerEmail || 'Sin cliente' }}
                · {{ formatDeliveryMethod(order.deliveryMethod) }}
              </p>
            </div>
            <div class="shrink-0 text-right">
              <p class="font-medium">{{ formatPrice(order.total, order.currencyCode) }}</p>
              <p class="text-admin-muted text-xs">{{ formatAdminDate(order.createdAt) }}</p>
            </div>
          </button>
        </div>
      </AdminCard>

      <AdminCard title="Pedidos hoy por estado">
        <div v-if="!stats.ordersByStatus.length" class="text-admin-muted text-sm">
          Sin pedidos hoy.
        </div>
        <div v-else class="space-y-2">
          <div
            v-for="row in stats.ordersByStatus"
            :key="row.status"
            class="flex items-center justify-between text-sm"
          >
            <span>{{ formatOrderStatus(row.status) }}</span>
            <UiBadge variant="default">{{ row.count }}</UiBadge>
          </div>
        </div>
      </AdminCard>
    </div>

    <AdminCard
      title="Tu perfil"
      description="Resumen de tu sesión en el panel administrativo"
    >
      <div v-if="profilePending" class="text-admin-muted text-sm">Cargando perfil…</div>
      <div v-else-if="profile" class="grid gap-4 sm:grid-cols-2">
        <AdminDetailCell label="Nombre">
          <p class="font-medium">{{ displayName }}</p>
        </AdminDetailCell>
        <AdminDetailCell label="Correo">
          <p class="font-medium">{{ profile.email }}</p>
        </AdminDetailCell>
        <AdminDetailCell label="Roles">
          <p class="font-medium">{{ rolesLabel }}</p>
        </AdminDetailCell>
        <AdminDetailCell label="Permisos">
          <p class="text-sm">{{ permissionsCount }} asignados</p>
        </AdminDetailCell>
      </div>
    </AdminCard>
  </div>
</template>
