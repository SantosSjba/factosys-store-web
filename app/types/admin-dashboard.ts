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

export type DashboardStats = {
  currencyCode: string
  ordersToday: number
  ordersYesterday: number
  ordersTrendPercent: number
  revenueToday: string
  pendingPaymentOrders: number
  processingOrders: number
  productsActive: number
  staffUsers: number
  lowStockItems: number
  ordersByStatus: Array<{ status: OrderStatus; count: number }>
  recentOrders: DashboardRecentOrder[]
}
