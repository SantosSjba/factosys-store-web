export type AdminCampaignBanner = {
  id: string
  title: string
  imageUrl: string | null
  placement: string
}

export type AdminCampaign = {
  id: string
  name: string
  slug: string
  description: string | null
  couponId: string | null
  couponCode: string | null
  bannerIds: string[]
  banners: AdminCampaignBanner[]
  startsAt: string | null
  expiresAt: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type CreateCampaignPayload = {
  name: string
  slug?: string
  description?: string
  couponId?: string
  bannerIds?: string[]
  startsAt?: string
  expiresAt?: string
  isActive?: boolean
}

export type UpdateCampaignPayload = Partial<CreateCampaignPayload>
