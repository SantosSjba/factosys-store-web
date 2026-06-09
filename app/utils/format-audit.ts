import type { AdminAuditAction } from '~/types/admin-audit'
import { formatModuleLabel } from '~/constants/admin-permissions'

const ACTION_LABELS: Record<AdminAuditAction, string> = {
  CREATE: 'Creación',
  UPDATE: 'Actualización',
  DELETE: 'Eliminación',
  STATUS_CHANGE: 'Cambio de estado',
  UPLOAD: 'Subida',
  IMPORT: 'Importación',
  EXPORT: 'Exportación',
}

export function formatAuditAction(action: AdminAuditAction): string {
  return ACTION_LABELS[action] ?? action
}

export function formatAuditModule(module: string): string {
  return formatModuleLabel(module)
}

export function auditActionVariant(action: AdminAuditAction) {
  if (action === 'DELETE') return 'danger' as const
  if (action === 'CREATE') return 'success' as const
  if (action === 'STATUS_CHANGE') return 'warning' as const
  return 'default' as const
}
