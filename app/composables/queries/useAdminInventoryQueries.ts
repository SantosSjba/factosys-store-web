import { useQuery } from '@tanstack/vue-query'
import {
  fetchAdminActiveWarehouses,
  fetchAdminMovements,
  fetchAdminStock,
  fetchAdminWarehouses,
} from '~/api/admin-inventory.api'
import { adminQueryKeys } from '~/constants/query-keys'
import type { ListMovementsParams, ListStockParams } from '~/types/admin-inventory'
import type { PaginationParams } from '~/types/pagination'

function inventoryEnabled(canRead: () => boolean) {
  const adminAuth = useAdminAuthStore()
  return computed(() => {
    if (!adminAuth.accessToken) return false
    if (!adminAuth.profile) return true
    return canRead()
  })
}

export function useAdminWarehousesQuery(params: MaybeRefOrGetter<PaginationParams> = {}) {
  const { can } = useAdminPermissions()
  const queryParams = computed(() => {
    const raw = toValue(params)
    return {
      page: raw.page ?? 1,
      limit: raw.limit ?? 10,
      search: raw.search?.trim() || undefined,
    }
  })

  return useQuery({
    queryKey: computed(() => [...adminQueryKeys.inventoryWarehouses(), queryParams.value]),
    queryFn: () => fetchAdminWarehouses(queryParams.value),
    enabled: inventoryEnabled(() => can('inventory.read')),
  })
}

export function useAdminActiveWarehousesQuery() {
  const { can } = useAdminPermissions()

  return useQuery({
    queryKey: adminQueryKeys.inventoryActiveWarehouses(),
    queryFn: fetchAdminActiveWarehouses,
    enabled: inventoryEnabled(() => can('inventory.read')),
  })
}

export function useAdminStockQuery(params: MaybeRefOrGetter<ListStockParams> = {}) {
  const { can } = useAdminPermissions()
  const queryParams = computed(() => {
    const raw = toValue(params)
    return {
      page: raw.page ?? 1,
      limit: raw.limit ?? 10,
      search: raw.search?.trim() || undefined,
      warehouseId: raw.warehouseId || undefined,
      lowStock: raw.lowStock || undefined,
    }
  })

  return useQuery({
    queryKey: computed(() => [...adminQueryKeys.inventoryStock(), queryParams.value]),
    queryFn: () => fetchAdminStock(queryParams.value),
    enabled: inventoryEnabled(() => can('inventory.read')),
  })
}

export function useAdminMovementsQuery(params: MaybeRefOrGetter<ListMovementsParams> = {}) {
  const { can } = useAdminPermissions()
  const queryParams = computed(() => {
    const raw = toValue(params)
    return {
      page: raw.page ?? 1,
      limit: raw.limit ?? 10,
      warehouseId: raw.warehouseId || undefined,
      variantId: raw.variantId || undefined,
    }
  })

  return useQuery({
    queryKey: computed(() => [...adminQueryKeys.inventoryMovements(), queryParams.value]),
    queryFn: () => fetchAdminMovements(queryParams.value),
    enabled: inventoryEnabled(() => can('inventory.read')),
  })
}
