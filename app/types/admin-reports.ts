import type { OrderStatus } from '~/types/admin-orders'

export type SalesReportParams = {
  dateFrom?: string
  dateTo?: string
}

export type SalesReportDailyPoint = {
  date: string
  orders: number
  revenue: string
}

export type SalesReport = {
  currencyCode: string
  range: { from: string; to: string }
  ordersCount: number
  revenueTotal: string
  subtotalTotal: string
  taxTotal: string
  shippingTotal: string
  discountTotal: string
  averageOrderValue: string
  ordersByStatus: Array<{ status: OrderStatus; count: number }>
  dailySeries: SalesReportDailyPoint[]
}

export type TopProductRow = {
  rank: number
  productId: string
  productName: string
  sku: string
  quantitySold: number
  revenue: string
}

export type TopProductsReport = {
  range: { from: string; to: string }
  items: TopProductRow[]
}

export type MarginReport = {
  range: { from: string; to: string }
  revenue: string
  cost: string
  margin: string
  marginPercent: string
  itemsAnalyzed: number
}

export type InventoryValuationRow = {
  sku: string
  productName: string
  variantName: string | null
  warehouseName: string
  quantity: number
  lowStockThreshold: number | null
  retailValue: string
  costValue: string
}

export type InventoryValuationReport = {
  currencyCode: string
  totalUnits: number
  totalRetailValue: string
  totalCostValue: string
  lowStockCount: number
  items: InventoryValuationRow[]
}

export type CatalogImportResult = {
  created: number
  updated: number
  errors: string[]
}
