<script setup lang="ts">
import type { DashboardRecentOrder, DashboardStatsParams } from '~/types/admin-dashboard'
import {
  formatDeliveryMethod,
  formatOrderStatus,
} from '~/utils/format-order'

definePageMeta({
  layout: 'intranet',
  middleware: 'admin-auth',
  adminTitle: 'Dashboard',
})

const { can } = useAdminPermissions()
const adminAuth = useAdminAuthStore()
const { data: profile, isPending: profilePending } = useAdminProfileQuery()

type RangePreset = '7d' | '30d' | 'custom'
const rangePreset = ref<RangePreset>('7d')
const customFrom = ref('')
const customTo = ref('')

function buildPresetRange(days: number): DashboardStatsParams {
  const end = new Date()
  end.setHours(23, 59, 59, 999)
  const start = new Date(end)
  start.setDate(start.getDate() - (days - 1))
  start.setHours(0, 0, 0, 0)
  return { dateFrom: start.toISOString(), dateTo: end.toISOString() }
}

const dashboardRange = computed<DashboardStatsParams>(() => {
  if (rangePreset.value === '7d') return buildPresetRange(7)
  if (rangePreset.value === '30d') return buildPresetRange(30)
  if (customFrom.value && customTo.value) {
    const start = new Date(`${customFrom.value}T00:00:00`)
    const end = new Date(`${customTo.value}T23:59:59.999`)
    return { dateFrom: start.toISOString(), dateTo: end.toISOString() }
  }
  return buildPresetRange(7)
})

const { data: stats, isPending: statsPending } = useAdminDashboardQuery(
  dashboardRange,
  { refetchInterval: 45_000 },
)
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
  return `${sign}${value}% vs período anterior`
})

const trendUp = computed(() => (stats.value?.ordersTrendPercent ?? 0) >= 0)

const onlineCustomersLabel = computed(() => {
  const online = stats.value?.onlineCustomers
  if (!online?.available) return '—'
  return String(online.count)
})

const onlineCustomersHint = computed(() => {
  const online = stats.value?.onlineCustomers
  if (!online) return ''
  if (!online.available) {
    return 'Activa Redis para ver clientes en línea'
  }
  return `Con actividad en los últimos ${online.windowMinutes} min`
})

const rangeLabel = computed(() => {
  if (!stats.value?.range) return ''
  return `${formatAdminDate(stats.value.range.from)} – ${formatAdminDate(stats.value.range.to)}`
})

function openOrder(order: DashboardRecentOrder) {
  navigateTo({ path: '/intranet/pedidos', query: { orderId: order.id } })
}

function setPreset(preset: RangePreset) {
  rangePreset.value = preset
  if (preset !== 'custom') {
    customFrom.value = ''
    customTo.value = ''
  }
}
</script>

<template>
  <div>
    <AdminPageTitle
      title="Dashboard"
      :description="`Bienvenido, ${welcomeName}. Vista general del panel admin.`"
    />

    <UiAlert v-if="!can('reports.read')" variant="warning" class="mb-6">
      No tienes permiso para ver reportes del dashboard (<code>reports.read</code>).
    </UiAlert>

    <template v-else>
      <div class="mb-6 flex flex-wrap items-end gap-3">
        <div class="flex gap-2">
          <UiButton
            size="sm"
            :variant="rangePreset === '7d' ? 'primary' : 'ghost'"
            @click="setPreset('7d')"
          >
            7 días
          </UiButton>
          <UiButton
            size="sm"
            :variant="rangePreset === '30d' ? 'primary' : 'ghost'"
            @click="setPreset('30d')"
          >
            30 días
          </UiButton>
          <UiButton
            size="sm"
            :variant="rangePreset === 'custom' ? 'primary' : 'ghost'"
            @click="setPreset('custom')"
          >
            Personalizado
          </UiButton>
        </div>
        <div v-if="rangePreset === 'custom'" class="flex flex-wrap items-end gap-2">
          <UiInput v-model="customFrom" label="Desde" type="date" class="w-40" />
          <UiInput v-model="customTo" label="Hasta" type="date" class="w-40" />
        </div>
        <p v-if="rangeLabel" class="text-admin-muted text-sm">{{ rangeLabel }}</p>
      </div>

      <div v-if="statsPending && !stats" class="text-admin-muted mb-6 flex items-center gap-2 text-sm">
        <UiSpinner size="sm" />
        Cargando métricas…
      </div>

      <div v-else-if="stats" class="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <AdminStatCard
          label="Pedidos en rango"
          :value="String(stats.ordersInRange)"
          :hint="`${stats.ordersPreviousRange} período anterior`"
          icon="orders"
          :trend="trendLabel"
          :trend-up="trendUp"
        />
        <AdminStatCard
          label="Ventas en rango"
          :value="formatPrice(stats.revenueInRange, stats.currencyCode)"
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
          label="Pedidos hoy"
          :value="String(stats.ordersToday)"
          :hint="`${stats.productsActive} productos activos`"
          icon="users"
        />
        <AdminStatCard
          label="Clientes en línea"
          :value="onlineCustomersLabel"
          :hint="onlineCustomersHint"
          icon="customers"
        />
      </div>

      <div v-if="stats" class="mb-6 grid gap-4 lg:grid-cols-2">
        <AdminCard title="Pedidos por día">
          <AdminDashboardBarChart
            :series="stats.dailySeries"
            :currency-code="stats.currencyCode"
            metric="orders"
          />
        </AdminCard>
        <AdminCard title="Ventas por día">
          <AdminDashboardBarChart
            :series="stats.dailySeries"
            :currency-code="stats.currencyCode"
            metric="revenue"
          />
        </AdminCard>
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

        <AdminCard title="Pedidos en rango por estado">
          <div v-if="!stats.ordersByStatus.length" class="text-admin-muted text-sm">
            Sin pedidos en el rango.
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
    </template>

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
