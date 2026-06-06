export type AdminNavIconName =
  | 'dashboard'
  | 'catalog'
  | 'orders'
  | 'users'
  | 'settings'

export const adminNavIcons: Record<AdminNavIconName, string> = {
  dashboard: 'lucide:layout-dashboard',
  catalog: 'lucide:package',
  orders: 'lucide:shopping-bag',
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
      { label: 'Catálogo', to: '/intranet/catalogo', icon: 'catalog', soon: true },
      { label: 'Pedidos', to: '/intranet/pedidos', icon: 'orders', soon: true },
    ],
  },
  {
    type: 'group',
    label: 'Sistema',
    children: [
      { label: 'Usuarios', to: '/intranet/usuarios', icon: 'users' },
      { label: 'Configuración', to: '/intranet/configuracion', icon: 'settings', soon: true },
    ],
  },
]
