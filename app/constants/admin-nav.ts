export type AdminNavIconName =
  | 'dashboard'
  | 'catalog'
  | 'inventory'
  | 'orders'
  | 'customers'
  | 'coupons'
  | 'users'
  | 'settings'

export const adminNavIcons: Record<AdminNavIconName, string> = {
  dashboard: 'lucide:layout-dashboard',
  catalog: 'lucide:package',
  inventory: 'lucide:warehouse',
  orders: 'lucide:shopping-bag',
  customers: 'lucide:shopping-cart',
  coupons: 'lucide:ticket',
  users: 'lucide:users',
  settings: 'lucide:settings',
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
    type: 'group',
    label: 'Gestión',
    children: [
      { label: 'Clientes', to: '/intranet/clientes', icon: 'customers', permission: 'users.read' },
      { label: 'Catálogo', to: '/intranet/catalogo', icon: 'catalog', permission: 'products.read' },
      { label: 'Inventario', to: '/intranet/inventario', icon: 'inventory', permission: 'inventory.read' },
      { label: 'Pedidos', to: '/intranet/pedidos', icon: 'orders', permission: 'orders.read' },
      { label: 'Cupones', to: '/intranet/cupones', icon: 'coupons', permission: 'coupons.read' },
    ],
  },
  {
    type: 'group',
    label: 'Sistema',
    children: [
      { label: 'Usuarios', to: '/intranet/usuarios', icon: 'users', permission: 'users.read' },
      { label: 'Configuración', to: '/intranet/configuracion', icon: 'settings', permission: 'settings.read' },
    ],
  },
]
