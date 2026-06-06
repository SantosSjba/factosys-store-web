import type { StaffUserStatus } from '~/types/admin-users'
import type { UiBadgeVariant } from '~/types/ui'

const STATUS_LABELS: Record<StaffUserStatus, string> = {
  ACTIVE: 'Activo',
  SUSPENDED: 'Suspendido',
  PENDING_VERIFICATION: 'Pendiente',
}

const STATUS_VARIANTS: Record<StaffUserStatus, UiBadgeVariant> = {
  ACTIVE: 'success',
  SUSPENDED: 'danger',
  PENDING_VERIFICATION: 'warning',
}

export function formatUserStatus(status: string): string {
  return STATUS_LABELS[status as StaffUserStatus] ?? status
}

export function userStatusVariant(status: string): UiBadgeVariant {
  return STATUS_VARIANTS[status as StaffUserStatus] ?? 'default'
}
