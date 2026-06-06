export type CustomerAuthProvider = 'LOCAL' | 'GOOGLE'

export type CustomerStatus = 'PENDING_VERIFICATION' | 'ACTIVE' | 'SUSPENDED'

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

export type UpdateCustomerPayload = {
  firstName?: string
  lastName?: string
  phone?: string
  status?: CustomerStatus
  password?: string
  clearEmailVerification?: boolean
}
