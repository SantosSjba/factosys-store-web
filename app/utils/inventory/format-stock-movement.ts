export function formatStockMovementType(type: string) {
  const labels: Record<string, string> = {
    RECEIPT: 'Entrada',
    SHIPMENT: 'Salida',
    ADJUSTMENT: 'Ajuste',
    TRANSFER: 'Transferencia',
  }
  return labels[type] ?? type
}

export function stockMovementVariant(type: string): 'success' | 'danger' | 'info' | 'default' {
  if (type === 'RECEIPT') return 'success'
  if (type === 'SHIPMENT') return 'danger'
  if (type === 'TRANSFER') return 'info'
  return 'default'
}
