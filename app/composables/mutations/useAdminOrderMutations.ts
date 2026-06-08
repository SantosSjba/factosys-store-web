import { useMutation, useQueryClient } from '@tanstack/vue-query'
import {
  cancelAdminOrder,
  createAdminOrder,
  updateAdminOrderPayment,
  updateAdminOrderStatus,
} from '~/api/admin-orders.api'
import { adminQueryKeys } from '~/constants/query-keys'
import type {
  CancelOrderPayload,
  CreateOrderPayload,
  UpdateOrderPaymentPayload,
  UpdateOrderStatusPayload,
} from '~/types/admin-orders'

function invalidateOrders(queryClient: ReturnType<typeof useQueryClient>, orderId?: string) {
  queryClient.invalidateQueries({ queryKey: adminQueryKeys.orders() })
  if (orderId) {
    queryClient.invalidateQueries({ queryKey: adminQueryKeys.order(orderId) })
  }
}

export function useAdminCreateOrderMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => createAdminOrder(payload),
    onSuccess: (order) => invalidateOrders(queryClient, order.id),
  })
}

export function useAdminUpdateOrderStatusMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateOrderStatusPayload }) =>
      updateAdminOrderStatus(id, payload),
    onSuccess: (order) => invalidateOrders(queryClient, order.id),
  })
}

export function useAdminUpdateOrderPaymentMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateOrderPaymentPayload }) =>
      updateAdminOrderPayment(id, payload),
    onSuccess: (order) => invalidateOrders(queryClient, order.id),
  })
}

export function useAdminCancelOrderMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload?: CancelOrderPayload }) =>
      cancelAdminOrder(id, payload),
    onSuccess: (order) => invalidateOrders(queryClient, order.id),
  })
}
