import type {
  CreateStockMovementPayload,
  CreateWarehousePayload,
  InventoryMovement,
  InventoryStockLevel,
  InventoryWarehouse,
  ListMovementsParams,
  ListStockParams,
  UpdateWarehousePayload,
  VariantLookup,
} from '~/types/admin-inventory'
import type { PaginatedResponse, PaginationParams } from '~/types/pagination'

export async function fetchAdminWarehouses(params: PaginationParams = {}) {
  const { data } = await useAdminApi().get<PaginatedResponse<InventoryWarehouse>>(
    '/admin/inventory/warehouses',
    { params: { page: 1, limit: 10, ...params } },
  )
  return data
}

export async function fetchAdminActiveWarehouses() {
  const { data } = await useAdminApi().get<InventoryWarehouse[]>(
    '/admin/inventory/warehouses/active',
  )
  return data
}

export async function createAdminWarehouse(payload: CreateWarehousePayload) {
  const { data } = await useAdminApi().post<InventoryWarehouse>(
    '/admin/inventory/warehouses',
    payload,
  )
  return data
}

export async function updateAdminWarehouse(id: string, payload: UpdateWarehousePayload) {
  const { data } = await useAdminApi().patch<InventoryWarehouse>(
    `/admin/inventory/warehouses/${id}`,
    payload,
  )
  return data
}

export async function deleteAdminWarehouse(id: string) {
  const { data } = await useAdminApi().delete<{ message: string }>(
    `/admin/inventory/warehouses/${id}`,
  )
  return data
}

export async function fetchAdminStock(params: ListStockParams = {}) {
  const { data } = await useAdminApi().get<PaginatedResponse<InventoryStockLevel>>(
    '/admin/inventory/stock',
    { params: { page: 1, limit: 10, ...params } },
  )
  return data
}

export async function fetchAdminMovements(params: ListMovementsParams = {}) {
  const { data } = await useAdminApi().get<PaginatedResponse<InventoryMovement>>(
    '/admin/inventory/movements',
    { params: { page: 1, limit: 10, ...params } },
  )
  return data
}

export async function createAdminStockMovement(payload: CreateStockMovementPayload) {
  const { data } = await useAdminApi().post<InventoryMovement>(
    '/admin/inventory/movements',
    payload,
  )
  return data
}

export async function lookupAdminVariants(search: string) {
  const { data } = await useAdminApi().get<VariantLookup[]>(
    '/admin/inventory/variants/lookup',
    { params: { search } },
  )
  return data
}

export async function updateAdminStockThreshold(stockLevelId: string, lowStockThreshold: number) {
  const { data } = await useAdminApi().patch<InventoryStockLevel>(
    `/admin/inventory/stock/${stockLevelId}/threshold`,
    { lowStockThreshold },
  )
  return data
}
