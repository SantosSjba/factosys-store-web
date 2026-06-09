import type {
  AdminCoupon,
  AdminCouponStats,
  CreateCouponPayload,
  UpdateCouponPayload,
} from '~/types/admin-coupons'
import type { PaginatedResponse, PaginationParams } from '~/types/pagination'

export async function fetchAdminCouponStats() {
  const { data } = await useAdminApi().get<AdminCouponStats>('/admin/coupons/stats')
  return data
}

export async function fetchAdminCoupons(params: PaginationParams = {}) {
  const { data } = await useAdminApi().get<PaginatedResponse<AdminCoupon>>(
    '/admin/coupons',
    { params },
  )
  return data
}

export async function createAdminCoupon(payload: CreateCouponPayload) {
  const { data } = await useAdminApi().post<AdminCoupon>('/admin/coupons', payload)
  return data
}

export async function updateAdminCoupon(id: string, payload: UpdateCouponPayload) {
  const { data } = await useAdminApi().patch<AdminCoupon>(
    `/admin/coupons/${id}`,
    payload,
  )
  return data
}
