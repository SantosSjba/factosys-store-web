export type BannerPlacement = 'HOME_HERO' | 'HOME_SECONDARY' | 'CATEGORY_TOP'

export type AdminBanner = {
  id: string
  title: string
  subtitle: string | null
  imageKey: string | null
  imageUrl: string | null
  linkUrl: string | null
  placement: BannerPlacement
  sortOrder: number
  startsAt: string | null
  expiresAt: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type CreateBannerPayload = {
  title: string
  subtitle?: string
  linkUrl?: string
  placement?: BannerPlacement
  sortOrder?: number
  startsAt?: string
  expiresAt?: string
  isActive?: boolean
}

export type UpdateBannerPayload = Partial<CreateBannerPayload>
