export type ShippingZone = {
  id: string
  name: string
  department: string | null
  province: string | null
  flatFee: string
  freeShippingMinAmount: string | null
  isActive: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export type CreateShippingZonePayload = {
  name: string
  department?: string
  province?: string
  flatFee: number
  freeShippingMinAmount?: number
  isActive?: boolean
  sortOrder?: number
}

export type UpdateShippingZonePayload = Partial<CreateShippingZonePayload>
