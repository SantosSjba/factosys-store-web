import type { SalesReportParams } from '~/types/admin-reports'

async function downloadCsv(path: string, filename: string, params: SalesReportParams = {}) {
  const response = await useAdminApi().get(path, {
    params: {
      dateFrom: params.dateFrom || undefined,
      dateTo: params.dateTo || undefined,
    },
    responseType: 'blob',
  })
  const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
  URL.revokeObjectURL(link.href)
}

export function downloadSalesReportExport(params: SalesReportParams = {}) {
  return downloadCsv(
    '/admin/reports/sales/export',
    `ventas-${new Date().toISOString().slice(0, 10)}.csv`,
    params,
  )
}

export function downloadTopProductsExport(params: SalesReportParams = {}) {
  return downloadCsv(
    '/admin/reports/top-products/export',
    `top-productos-${new Date().toISOString().slice(0, 10)}.csv`,
    params,
  )
}

export function downloadMarginReportExport(params: SalesReportParams = {}) {
  return downloadCsv(
    '/admin/reports/margin/export',
    `margen-${new Date().toISOString().slice(0, 10)}.csv`,
    params,
  )
}

export async function downloadInventoryValuationExport() {
  const response = await useAdminApi().get('/admin/reports/inventory-valuation/export', {
    responseType: 'blob',
  })
  const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `inventario-valorizado-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(link.href)
}
