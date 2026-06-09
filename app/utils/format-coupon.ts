import type { AdminCoupon } from '~/types/admin-coupons'

export type CouponLifecycleStatus =
  | 'active'
  | 'inactive'
  | 'scheduled'
  | 'expired'
  | 'exhausted'

export function formatCouponType(type: AdminCoupon['type']) {
  return type === 'PERCENT' ? 'Porcentaje' : 'Monto fijo'
}

export function formatCouponValue(coupon: AdminCoupon, currencyCode = 'PEN') {
  if (coupon.type === 'PERCENT') return `${coupon.value}%`
  return formatPrice(coupon.value, currencyCode)
}

export function getCouponLifecycleStatus(coupon: AdminCoupon): CouponLifecycleStatus {
  const now = Date.now()

  if (!coupon.isActive) return 'inactive'
  if (coupon.maxUses != null && coupon.usedCount >= coupon.maxUses) return 'exhausted'
  if (coupon.startsAt && new Date(coupon.startsAt).getTime() > now) return 'scheduled'
  if (coupon.expiresAt && new Date(coupon.expiresAt).getTime() < now) return 'expired'
  return 'active'
}

export function formatCouponLifecycleStatus(status: CouponLifecycleStatus) {
  const labels: Record<CouponLifecycleStatus, string> = {
    active: 'Vigente',
    inactive: 'Inactivo',
    scheduled: 'Programado',
    expired: 'Expirado',
    exhausted: 'Agotado',
  }
  return labels[status]
}

export function couponLifecycleVariant(
  status: CouponLifecycleStatus,
): 'success' | 'default' | 'warning' | 'danger' {
  if (status === 'active') return 'success'
  if (status === 'scheduled') return 'warning'
  if (status === 'expired' || status === 'exhausted') return 'danger'
  return 'default'
}

export function formatCouponValidity(coupon: AdminCoupon) {
  if (!coupon.startsAt && !coupon.expiresAt) return 'Sin límite de fechas'
  const from = coupon.startsAt ? formatAdminDate(coupon.startsAt) : 'Siempre'
  const to = coupon.expiresAt ? formatAdminDate(coupon.expiresAt) : 'Sin vencimiento'
  return `${from} → ${to}`
}

export function formatCouponUses(coupon: AdminCoupon) {
  if (coupon.maxUses == null) return `${coupon.usedCount} usos`
  return `${coupon.usedCount} / ${coupon.maxUses}`
}
