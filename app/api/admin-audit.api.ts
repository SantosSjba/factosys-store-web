import type { AdminAuditEntry, ListAuditParams } from '~/types/admin-audit'
import type { PaginatedResponse } from '~/types/pagination'

export async function fetchAdminAudit(params: ListAuditParams = {}) {
  const { data } = await useAdminApi().get<PaginatedResponse<AdminAuditEntry>>(
    '/admin/audit',
    { params: { page: 1, limit: 20, ...params } },
  )
  return data
}
