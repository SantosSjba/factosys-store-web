import type { OrderDeliveryMethod, OrderPaymentStatus, OrderStatus } from '~/types/admin-orders'

export type DashboardRecentOrder = {
  id: string
  orderNumber: string
  status: OrderStatus
  paymentStatus: OrderPaymentStatus
  deliveryMethod: OrderDeliveryMethod
  customerName: string | null
  customerEmail: string | null
  total: string
  currencyCode: string
  itemCount: number
  createdAt: string
}

export type DashboardDailyPoint = {
  date: string
  orders: number
  revenue: string
}

export type DashboardStatsRange = {
  from: string
  to: string
}

export type DashboardStatsParams = {
  dateFrom?: string
  dateTo?: string
}

export type DashboardStats = {
  currencyCode: string
  range: DashboardStatsRange
  ordersInRange: number
  ordersPreviousRange: number
  ordersTrendPercent: number
  revenueInRange: string
  ordersToday: number
  pendingPaymentOrders: number
  processingOrders: number
  productsActive: number
  staffUsers: number
  lowStockItems: number
  dailySeries: DashboardDailyPoint[]
  ordersByStatus: Array<{ status: OrderStatus; count: number }>
  recentOrders: DashboardRecentOrder[]
}
