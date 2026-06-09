import type { ReturnRequestReason, ReturnRequestStatus } from '~/types/admin-returns'

const STATUS_LABELS: Record<ReturnRequestStatus, string> = {
  REQUESTED: 'Solicitada',
  APPROVED: 'Aprobada',
  REJECTED: 'Rechazada',
  RECEIVED: 'Recibida',
  REFUNDED: 'Reembolsada',
  CANCELLED: 'Cancelada',
}

const REASON_LABELS: Record<ReturnRequestReason, string> = {
  DEFECTIVE: 'Producto defectuoso',
  WRONG_ITEM: 'Producto incorrecto',
  NOT_AS_DESCRIBED: 'No coincide con la descripción',
  CHANGED_MIND: 'Cambio de opinión',
  OTHER: 'Otro',
}

export function formatReturnStatus(status: ReturnRequestStatus): string {
  return STATUS_LABELS[status] ?? status
}

export function formatReturnReason(reason: ReturnRequestReason): string {
  return REASON_LABELS[reason] ?? reason
}

export function returnStatusVariant(status: ReturnRequestStatus) {
  if (status === 'REFUNDED') return 'success' as const
  if (status === 'REJECTED' || status === 'CANCELLED') return 'danger' as const
  if (status === 'APPROVED' || status === 'RECEIVED') return 'info' as const
  return 'warning' as const
}

export const RETURN_STATUS_OPTIONS = Object.entries(STATUS_LABELS).map(([value, label]) => ({
  value: value as ReturnRequestStatus,
  label,
}))

export const RETURN_REASON_OPTIONS = Object.entries(REASON_LABELS).map(([value, label]) => ({
  value: value as ReturnRequestReason,
  label,
}))
