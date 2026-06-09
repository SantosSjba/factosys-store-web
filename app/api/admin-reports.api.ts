import type {
  InventoryValuationReport,
  MarginReport,
  SalesReport,
  SalesReportParams,
  TopProductsReport,
} from '~/types/admin-reports'

export async function fetchAdminSalesReport(params: SalesReportParams = {}) {
  const { data } = await useAdminApi().get<SalesReport>('/admin/reports/sales', {
    params,
  })
  return data
}

export async function fetchAdminTopProducts(params: SalesReportParams & { limit?: number } = {}) {
  const { data } = await useAdminApi().get<TopProductsReport>(
    '/admin/reports/top-products',
    { params: { limit: 10, ...params } },
  )
  return data
}

export function getAdminSalesExportUrl(params: SalesReportParams = {}) {
  const query = new URLSearchParams()
  if (params.dateFrom) query.set('dateFrom', params.dateFrom)
  if (params.dateTo) query.set('dateTo', params.dateTo)
  const qs = query.toString()
  return `/admin/reports/sales/export${qs ? `?${qs}` : ''}`
}

export function getAdminTopProductsExportUrl(params: SalesReportParams = {}) {
  const query = new URLSearchParams()
  if (params.dateFrom) query.set('dateFrom', params.dateFrom)
  if (params.dateTo) query.set('dateTo', params.dateTo)
  const qs = query.toString()
  return `/admin/reports/top-products/export${qs ? `?${qs}` : ''}`
}

export async function fetchAdminMarginReport(params: SalesReportParams = {}) {
  const { data } = await useAdminApi().get<MarginReport>('/admin/reports/margin', { params })
  return data
}

export async function fetchAdminInventoryValuationReport() {
  const { data } = await useAdminApi().get<InventoryValuationReport>(
    '/admin/reports/inventory-valuation',
  )
  return data
}

export function getAdminMarginExportUrl(params: SalesReportParams = {}) {
  const query = new URLSearchParams()
  if (params.dateFrom) query.set('dateFrom', params.dateFrom)
  if (params.dateTo) query.set('dateTo', params.dateTo)
  const qs = query.toString()
  return `/admin/reports/margin/export${qs ? `?${qs}` : ''}`
}

export function getAdminInventoryExportUrl() {
  return '/admin/reports/inventory-valuation/export'
}
