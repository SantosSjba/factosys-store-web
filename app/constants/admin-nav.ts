export type AdminNavIconName =
  | 'dashboard'
  | 'catalog'
  | 'inventory'
  | 'orders'
  | 'customers'
  | 'coupons'
  | 'marketing'
  | 'reports'
  | 'users'
  | 'settings'
  | 'audit'
  | 'media'
  | 'returns'

export const adminNavIcons: Record<AdminNavIconName, string> = {
  dashboard: 'lucide:layout-dashboard',
  catalog: 'lucide:package',
  inventory: 'lucide:warehouse',
  orders: 'lucide:shopping-bag',
  customers: 'lucide:shopping-cart',
  coupons: 'lucide:ticket',
  marketing: 'lucide:megaphone',
  reports: 'lucide:bar-chart-3',
  users: 'lucide:users',
  settings: 'lucide:settings',
  audit: 'lucide:scroll-text',
  media: 'lucide:images',
  returns: 'lucide:undo-2',
}

export type AdminNavLink = {
  type: 'link'
  label: string
  to: string
  icon: AdminNavIconName
  permission?: string
  soon?: boolean
}

export type AdminNavGroup = {
  type: 'group'
  label: string
  children: Omit<AdminNavLink, 'type'>[]
}

export type AdminNavEntry = AdminNavLink | AdminNavGroup

export const adminNavMenu: AdminNavEntry[] = [
  {
    type: 'link',
    label: 'Dashboard',
    to: '/intranet',
    icon: 'dashboard',
    permission: 'reports.read',
  },
  {
    type: 'link',
    label: 'Reportes',
    to: '/intranet/reportes',
    icon: 'reports',
    permission: 'reports.read',
  },
  {
    type: 'group',
    label: 'Gestión',
    children: [
      { label: 'Clientes', to: '/intranet/clientes', icon: 'customers', permission: 'users.read' },
      { label: 'Catálogo', to: '/intranet/catalogo', icon: 'catalog', permission: 'products.read' },
      { label: 'Inventario', to: '/intranet/inventario', icon: 'inventory', permission: 'inventory.read' },
      { label: 'Pedidos', to: '/intranet/pedidos', icon: 'orders', permission: 'orders.read' },
      { label: 'Devoluciones', to: '/intranet/devoluciones', icon: 'returns', permission: 'returns.read' },
    ],
  },
  {
    type: 'group',
    label: 'Marketing',
    children: [
      { label: 'Cupones', to: '/intranet/cupones', icon: 'coupons', permission: 'coupons.read' },
      { label: 'Banners', to: '/intranet/banners', icon: 'marketing', permission: 'marketing.read' },
      { label: 'Campañas', to: '/intranet/campanas', icon: 'marketing', permission: 'marketing.read' },
    ],
  },
  {
    type: 'group',
    label: 'Sistema',
    children: [
      { label: 'Usuarios', to: '/intranet/usuarios', icon: 'users', permission: 'users.read' },
      { label: 'Auditoría', to: '/intranet/auditoria', icon: 'audit', permission: 'audit.read' },
      { label: 'Medios', to: '/intranet/medios', icon: 'media', permission: 'media.read' },
      { label: 'Configuración', to: '/intranet/configuracion', icon: 'settings', permission: 'settings.read' },
    ],
  },
]
