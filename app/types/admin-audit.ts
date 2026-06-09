export type AdminAuditAction =
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'STATUS_CHANGE'
  | 'UPLOAD'
  | 'IMPORT'
  | 'EXPORT'

export type AdminAuditUser = {
  id: string
  email: string
  name: string | null
}

export type AdminAuditEntry = {
  id: string
  action: AdminAuditAction
  module: string
  entityType: string | null
  entityId: string | null
  description: string
  metadata: Record<string, unknown> | null
  ipAddress: string | null
  createdAt: string
  user: AdminAuditUser | null
}

export type ListAuditParams = {
  page?: number
  limit?: number
  module?: string
  search?: string
}
