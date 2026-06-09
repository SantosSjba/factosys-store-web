export type CustomerAuthProvider = 'LOCAL' | 'GOOGLE'

export type CustomerStatus = 'PENDING_VERIFICATION' | 'ACTIVE' | 'SUSPENDED'

import type { OrderAddressType } from '~/types/admin-orders'

export type StoreCustomer = {
  id: string
  email: string
  userType: 'CUSTOMER'
  authProvider: CustomerAuthProvider
  status: CustomerStatus
  firstName: string | null
  lastName: string | null
  phone: string | null
  emailVerifiedAt: string | null
  createdAt: string
}

export type CreateCustomerPayload = {
  email: string
  password: string
  firstName?: string
  lastName?: string
  phone?: string
}

export type CustomerSavedAddress = {
  id: string
  type: OrderAddressType
  label: string | null
  firstName: string | null
  lastName: string | null
  company: string | null
  phone: string | null
  email: string | null
  addressLine1: string
  addressLine2: string | null
  city: string | null
  district: string | null
  province: string | null
  department: string | null
  country: string
  postalCode: string | null
  lastOrderNumber: string
  lastUsedAt: string
}

export type UpdateCustomerPayload = {
  firstName?: string
  lastName?: string
  phone?: string
  status?: CustomerStatus
  password?: string
  clearEmailVerification?: boolean
}
