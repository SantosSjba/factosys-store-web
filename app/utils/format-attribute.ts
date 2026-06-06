import type { AttributeDataType, AttributeScope } from '~/types/admin-catalog'

const SCOPE_LABELS: Record<AttributeScope, string> = {
  PRODUCT: 'Producto',
  VARIANT: 'Variante',
}

const DATA_TYPE_LABELS: Record<AttributeDataType, string> = {
  TEXT: 'Texto',
  NUMBER: 'Número',
  BOOLEAN: 'Sí/No',
  SELECT: 'Selección',
  MULTI_SELECT: 'Multi-selección',
}

export function formatAttributeScope(scope: AttributeScope | string) {
  return SCOPE_LABELS[scope as AttributeScope] ?? scope
}

export function formatAttributeDataType(type: AttributeDataType | string) {
  return DATA_TYPE_LABELS[type as AttributeDataType] ?? type
}
