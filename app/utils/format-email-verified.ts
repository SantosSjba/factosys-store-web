import type { UiBadgeVariant } from '~/types/ui'

export function isEmailVerified(emailVerifiedAt: string | null | undefined) {
  return emailVerifiedAt != null
}

export function formatEmailVerified(emailVerifiedAt: string | null | undefined) {
  return isEmailVerified(emailVerifiedAt) ? 'Verificado' : 'Pendiente'
}

export function emailVerifiedVariant(
  emailVerifiedAt: string | null | undefined,
): UiBadgeVariant {
  return isEmailVerified(emailVerifiedAt) ? 'success' : 'warning'
}
