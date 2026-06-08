export type AdminNavIconName =
  | 'dashboard'
  | 'catalog'
  | 'inventory'
  | 'orders'
  | 'customers'
  | 'users'
  | 'settings'

export const adminNavIcons: Record<AdminNavIconName, string> = {
  dashboard: 'lucide:layout-dashboard',
  catalog: 'lucide:package',
  inventory: 'lucide:warehouse',
  orders: 'lucide:shopping-bag',
  customers: 'lucide:shopping-cart',
  users: 'lucide:users',
  settings: 'lucide:settings',
}

export type AdminNavLink = {
  type: 'link'
  label: string
  to: string
  icon: AdminNavIconName
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
  },
  {
    type: 'group',
    label: 'Gestión',
    children: [
      { label: 'Clientes', to: '/intranet/clientes', icon: 'customers' },
      { label: 'Catálogo', to: '/intranet/catalogo', icon: 'catalog' },
      { label: 'Inventario', to: '/intranet/inventario', icon: 'inventory' },
      { label: 'Pedidos', to: '/intranet/pedidos', icon: 'orders' },
    ],
  },
  {
    type: 'group',
    label: 'Sistema',
    children: [
      { label: 'Usuarios', to: '/intranet/usuarios', icon: 'users' },
      { label: 'Configuración', to: '/intranet/configuracion', icon: 'settings' },
    ],
  },
]
