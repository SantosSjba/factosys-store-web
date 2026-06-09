export type LoginAuditResult = 'SUCCESS' | 'FAILURE'
export type LoginAuthMethod = 'PASSWORD' | 'GOOGLE' | 'REFRESH'
export type AuthAudience = 'STORE' | 'ADMIN'

export type LoginAuditUser = {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  userType: string
}

export type LoginAuditEntry = {
  id: string
  email: string
  userType: string | null
  audience: AuthAudience
  method: LoginAuthMethod
  result: LoginAuditResult
  failureReason: string | null
  ipAddress: string | null
  userAgent: string | null
  createdAt: string
  user: LoginAuditUser | null
}
