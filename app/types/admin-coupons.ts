export type CouponType = 'PERCENT' | 'FIXED'

export type AdminCoupon = {
  id: string
  code: string
  type: CouponType
  value: string
  minOrderAmount: string | null
  maxUses: number | null
  usedCount: number
  startsAt: string | null
  expiresAt: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type AdminCouponStats = {
  total: number
  active: number
  inactive: number
}

export type CreateCouponPayload = {
  code: string
  type: CouponType
  value: number
  minOrderAmount?: number
  maxUses?: number
  startsAt?: string
  expiresAt?: string
  isActive?: boolean
}

export type UpdateCouponPayload = Partial<CreateCouponPayload>
