export function formatAdminDate(value: string) {
  return new Date(value).toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function formatAdminDateTime(value: string | null | undefined) {
  if (!value) return '—'
  return new Date(value).toLocaleString('es-PE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}
