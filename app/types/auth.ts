export type UserType = 'CUSTOMER' | 'STAFF'

export interface AuthUser {
  id: string
  email: string
  userType: UserType
  firstName: string | null
  lastName: string | null
  roles: string[]
}

export interface AuthTokensResponse {
  accessToken: string
  refreshToken: string
  user: AuthUser
}

export interface StoreProfile {
  id: string
  email: string
  userType: UserType
  status: string
  firstName: string | null
  lastName: string | null
  phone: string | null
  roles: Array<string | { name?: string; slug?: string }>
  permissions: string[]
  createdAt: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  email: string
  password: string
  firstName?: string
  lastName?: string
  phone?: string
}

export interface RegisterResponse {
  message: string
  verificationToken?: string
}
