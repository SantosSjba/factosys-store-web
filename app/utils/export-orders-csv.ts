import type { ListOrdersParams } from '~/types/admin-orders'

export async function downloadOrdersExport(params: ListOrdersParams = {}) {
  const response = await useAdminApi().get('/admin/orders/export', {
    params: {
      search: params.search?.trim() || undefined,
      status: params.status || undefined,
      paymentStatus: params.paymentStatus || undefined,
      paymentMethod: params.paymentMethod || undefined,
      deliveryMethod: params.deliveryMethod || undefined,
      dateFrom: params.dateFrom || undefined,
      dateTo: params.dateTo || undefined,
    },
    responseType: 'blob',
  })
  const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `pedidos-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(link.href)
}
