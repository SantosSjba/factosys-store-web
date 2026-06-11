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

export type StoreAuthProvider = 'LOCAL' | 'GOOGLE'

/** Perfil del cliente en la tienda (`/store/me`). */
export interface StoreProfile {
  id: string
  email: string
  userType: UserType
  authProvider: StoreAuthProvider
  status: string
  firstName: string | null
  lastName: string | null
  phone: string | null
  emailVerifiedAt: string | null
  createdAt: string
}

/** Perfil staff en intranet (`/admin/users/me`). */
export interface AdminProfile {
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

export type UpdateStoreProfilePayload = {
  firstName?: string
  lastName?: string
  phone?: string
  password?: string
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
  acceptTerms: boolean
}

export interface RegisterResponse {
  message: string
  email: string
  verificationCode?: string
}

export interface VerifyEmailPayload {
  token?: string
  email?: string
  code?: string
  acceptTerms?: boolean
}

export interface ResendVerificationResponse {
  message: string
  verificationCode?: string
}
