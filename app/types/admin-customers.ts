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
