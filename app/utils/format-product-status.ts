import type { ProductStatus } from '~/types/admin-catalog'
import type { UiBadgeVariant } from '~/types/ui'

const STATUS_LABELS: Record<ProductStatus, string> = {
  DRAFT: 'Borrador',
  ACTIVE: 'Activo',
  ARCHIVED: 'Archivado',
}

const STATUS_VARIANTS: Record<ProductStatus, UiBadgeVariant> = {
  DRAFT: 'warning',
  ACTIVE: 'success',
  ARCHIVED: 'default',
}

export function formatProductStatus(status: ProductStatus | string): string {
  return STATUS_LABELS[status as ProductStatus] ?? status
}

export function productStatusVariant(status: ProductStatus | string): UiBadgeVariant {
  return STATUS_VARIANTS[status as ProductStatus] ?? 'default'
}
