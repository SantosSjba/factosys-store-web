<script setup lang="ts">
import type { AdminCoupon } from '~/types/admin-coupons'
import type { UiTableColumn } from '~/types/ui'
import {
  couponLifecycleVariant,
  formatCouponLifecycleStatus,
  formatCouponType,
  formatCouponUses,
  formatCouponValidity,
  formatCouponValue,
  getCouponLifecycleStatus,
} from '~/utils/format-coupon'

const { can } = useAdminPermissions()
const { data: stats, isPending: statsPending } = useAdminCouponStatsQuery()

const { page, search, isPending, items: coupons, paginationMeta } =
  usePaginatedAdminList<AdminCoupon>((params) => useAdminCouponsQuery(params))

const createOpen = ref(false)
const editOpen = ref(false)
const selectedCoupon = ref<AdminCoupon | null>(null)

const columns: UiTableColumn<AdminCoupon>[] = [
  { key: 'code', label: 'Código' },
  { key: 'type', label: 'Descuento', width: '9rem' },
  { key: 'minOrderAmount', label: 'Mínimo', width: '8rem' },
  { key: 'usedCount', label: 'Usos', width: '7rem' },
  { key: 'expiresAt', label: 'Vigencia', width: '11rem' },
  { key: 'isActive', label: 'Estado', width: '8rem' },
]

function openEdit(coupon: AdminCoupon) {
  selectedCoupon.value = coupon
  editOpen.value = true
}

function openCreate() {
  createOpen.value = true
}
</script>

<template>
  <div class="space-y-4">
    <div class="grid gap-4 sm:grid-cols-3">
      <AdminStatCard
        label="Total cupones"
        :value="statsPending && !stats ? '—' : String(stats?.total ?? 0)"
        hint="Códigos registrados"
        icon="coupons"
      />
      <AdminStatCard
        label="Activos"
        :value="statsPending && !stats ? '—' : String(stats?.active ?? 0)"
        hint="Disponibles para aplicar"
        icon="orders"
      />
      <AdminStatCard
        label="Inactivos"
        :value="statsPending && !stats ? '—' : String(stats?.inactive ?? 0)"
        hint="Pausados manualmente"
        icon="settings"
      />
    </div>

    <UiFilterBar title="Cupones y promociones">
      <UiSearchInput
        v-model="search"
        placeholder="Buscar por código…"
        class="min-w-[16rem] flex-1"
      />
      <template #actions>
        <UiButton v-if="can('coupons.write')" @click="openCreate">
          <UiIcon name="lucide:plus" :size="16" class="mr-2" />
          Nuevo cupón
        </UiButton>
      </template>
    </UiFilterBar>

    <AdminCard no-padding>
      <div
        v-if="!isPending && !coupons.length"
        class="px-2 py-4"
      >
        <UiEmptyState
          title="Sin cupones"
          description="Crea códigos de descuento para campañas, clientes frecuentes o promociones puntuales."
          icon="lucide:ticket"
        >
          <template #action>
            <UiButton v-if="can('coupons.write')" @click="openCreate">
              <UiIcon name="lucide:plus" :size="16" class="mr-2" />
              Crear primer cupón
            </UiButton>
          </template>
        </UiEmptyState>
      </div>

      <template v-else>
        <UiDataTable
          :columns="columns"
          :rows="coupons"
          :loading="isPending"
          empty-title="Sin cupones"
          empty-description="No hay cupones que coincidan con la búsqueda."
        >
          <template #cell-code="{ row }">
            <div class="flex items-center gap-2">
              <span
                class="bg-admin-muted/40 text-admin inline-flex rounded-md px-2 py-1 font-mono text-sm font-semibold tracking-wide"
              >
                {{ row.code }}
              </span>
            </div>
          </template>
          <template #cell-type="{ row }">
            <p class="font-medium">{{ formatCouponValue(row) }}</p>
            <p class="text-admin-muted text-xs">{{ formatCouponType(row.type) }}</p>
          </template>
          <template #cell-minOrderAmount="{ row }">
            {{
              row.minOrderAmount
                ? formatPrice(row.minOrderAmount, 'PEN')
                : '—'
            }}
          </template>
          <template #cell-usedCount="{ row }">
            {{ formatCouponUses(row) }}
          </template>
          <template #cell-expiresAt="{ row }">
            <p class="text-sm">{{ formatCouponValidity(row) }}</p>
          </template>
          <template #cell-isActive="{ row }">
            <UiBadge :variant="couponLifecycleVariant(getCouponLifecycleStatus(row))">
              {{ formatCouponLifecycleStatus(getCouponLifecycleStatus(row)) }}
            </UiBadge>
          </template>
          <template #actions="{ row }">
            <div class="flex justify-end gap-1">
              <UiIconButton
                v-if="can('coupons.write')"
                icon="lucide:pencil"
                ariaLabel="Editar cupón"
                @click="openEdit(row)"
              />
            </div>
          </template>
        </UiDataTable>

        <div
          v-if="paginationMeta && paginationMeta.total > 0"
          class="border-admin-line border-t px-4 py-3"
        >
          <UiPagination
            :page="paginationMeta.page"
            :page-size="paginationMeta.limit"
            :total="paginationMeta.total"
            tone="admin"
            @update:page="page = $event"
          />
        </div>
      </template>
    </AdminCard>

    <AdminCouponCreateModal v-if="can('coupons.write')" v-model="createOpen" />
    <AdminCouponEditModal
      v-if="can('coupons.write')"
      v-model="editOpen"
      :coupon="selectedCoupon"
    />
  </div>
</template>
