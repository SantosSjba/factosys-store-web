export function formatPrice(value: string | number | null | undefined, currency = 'PEN') {
  if (value == null || value === '') return '—'

  const amount = typeof value === 'string' ? Number(value) : value
  if (Number.isNaN(amount)) return '—'

  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount)
}
