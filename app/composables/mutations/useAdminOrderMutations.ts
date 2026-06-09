import { useMutation, useQueryClient } from '@tanstack/vue-query'
import {
  cancelAdminOrder,
  createAdminOrder,
  refundAdminOrder,
  updateAdminOrderNotes,
  updateAdminOrderPayment,
  updateAdminOrderShipment,
  updateAdminOrderStatus,
  uploadAdminOrderPaymentEvidence,
} from '~/api/admin-orders.api'
import { adminQueryKeys } from '~/constants/query-keys'
import type {
  CancelOrderPayload,
  CreateOrderPayload,
  RefundOrderPayload,
  UpdateOrderNotesPayload,
  UpdateOrderPaymentPayload,
  UpdateOrderShipmentPayload,
  UpdateOrderStatusPayload,
  UploadOrderPaymentEvidencePayload,
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

export function useAdminRefundOrderMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: RefundOrderPayload }) =>
      refundAdminOrder(id, payload),
    onSuccess: (order) => invalidateOrders(queryClient, order.id),
  })
}

export function useAdminUpdateOrderShipmentMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateOrderShipmentPayload }) =>
      updateAdminOrderShipment(id, payload),
    onSuccess: (order) => invalidateOrders(queryClient, order.id),
  })
}

export function useAdminUpdateOrderNotesMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateOrderNotesPayload }) =>
      updateAdminOrderNotes(id, payload),
    onSuccess: (order) => invalidateOrders(queryClient, order.id),
  })
}

export function useAdminUploadOrderPaymentEvidenceMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UploadOrderPaymentEvidencePayload }) =>
      uploadAdminOrderPaymentEvidence(id, payload),
    onSuccess: (order) => invalidateOrders(queryClient, order.id),
  })
}
