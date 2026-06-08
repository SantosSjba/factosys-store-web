import { useMutation, useQueryClient } from '@tanstack/vue-query'
import {
  createAdminStockMovement,
  createAdminStockReservation,
  createAdminWarehouse,
  deleteAdminWarehouse,
  releaseAdminStockReservation,
  updateAdminStockThreshold,
  updateAdminWarehouse,
} from '~/api/admin-inventory.api'
import { adminQueryKeys } from '~/constants/query-keys'
import type {
  CreateStockMovementPayload,
  CreateStockReservationPayload,
  CreateWarehousePayload,
  UpdateWarehousePayload,
} from '~/types/admin-inventory'

function invalidateInventory(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: adminQueryKeys.inventoryWarehouses() })
  queryClient.invalidateQueries({ queryKey: adminQueryKeys.inventoryActiveWarehouses() })
  queryClient.invalidateQueries({ queryKey: adminQueryKeys.inventoryStock() })
  queryClient.invalidateQueries({ queryKey: adminQueryKeys.inventoryMovements() })
  queryClient.invalidateQueries({ queryKey: adminQueryKeys.inventoryReservations() })
}

export function useAdminCreateWarehouseMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateWarehousePayload) => createAdminWarehouse(payload),
    onSuccess: () => invalidateInventory(queryClient),
  })
}

export function useAdminUpdateWarehouseMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateWarehousePayload }) =>
      updateAdminWarehouse(id, payload),
    onSuccess: () => invalidateInventory(queryClient),
  })
}

export function useAdminDeleteWarehouseMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteAdminWarehouse(id),
    onSuccess: () => invalidateInventory(queryClient),
  })
}

export function useAdminCreateStockMovementMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateStockMovementPayload) => createAdminStockMovement(payload),
    onSuccess: () => invalidateInventory(queryClient),
  })
}

export function useAdminUpdateStockThresholdMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      stockLevelId,
      lowStockThreshold,
    }: {
      stockLevelId: string
      lowStockThreshold: number
    }) => updateAdminStockThreshold(stockLevelId, lowStockThreshold),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminQueryKeys.inventoryStock() }),
  })
}

export function useAdminCreateStockReservationMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateStockReservationPayload) => createAdminStockReservation(payload),
    onSuccess: () => invalidateInventory(queryClient),
  })
}

export function useAdminReleaseStockReservationMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => releaseAdminStockReservation(id),
    onSuccess: () => invalidateInventory(queryClient),
  })
}
