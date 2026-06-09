export const PERMISSION_LABELS: Record<string, string> = {
  'users.read': 'Ver usuarios',
  'users.create': 'Crear usuarios',
  'users.update': 'Editar usuarios',
  'users.delete': 'Eliminar usuarios',
  'roles.read': 'Ver roles',
  'roles.assign': 'Asignar roles',
  'products.read': 'Ver productos',
  'products.write': 'Gestionar productos',
  'orders.read': 'Ver pedidos',
  'orders.write': 'Gestionar pedidos',
  'inventory.read': 'Ver inventario',
  'inventory.write': 'Gestionar inventario',
  'settings.read': 'Ver configuración',
  'settings.write': 'Editar configuración',
  'reports.read': 'Ver reportes',
  'coupons.read': 'Ver cupones',
  'coupons.write': 'Gestionar cupones',
  'marketing.read': 'Ver marketing',
  'marketing.write': 'Gestionar marketing',
}

export const MODULE_LABELS: Record<string, string> = {
  users: 'Usuarios',
  roles: 'Roles',
  products: 'Productos',
  orders: 'Pedidos',
  inventory: 'Inventario',
  settings: 'Configuración',
  reports: 'Reportes',
  coupons: 'Cupones',
  marketing: 'Marketing',
}

export const MODULE_ICONS: Record<string, string> = {
  users: 'lucide:users',
  roles: 'lucide:shield',
  products: 'lucide:package',
  orders: 'lucide:shopping-bag',
  inventory: 'lucide:warehouse',
  settings: 'lucide:settings',
  reports: 'lucide:bar-chart-3',
  coupons: 'lucide:ticket',
  marketing: 'lucide:megaphone',
}

export function formatPermissionLabel(slug: string): string {
  return PERMISSION_LABELS[slug] ?? slug
}

export function formatModuleLabel(module: string): string {
  return MODULE_LABELS[module] ?? module
}

export function getModuleIcon(module: string): string {
  return MODULE_ICONS[module] ?? 'lucide:folder'
}
