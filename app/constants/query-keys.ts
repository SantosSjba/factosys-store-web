export const storeQueryKeys = {
  all: ['store'] as const,
  profile: () => [...storeQueryKeys.all, 'profile'] as const,
}

export const adminQueryKeys = {
  all: ['admin'] as const,
  profile: () => [...adminQueryKeys.all, 'profile'] as const,
  users: () => [...adminQueryKeys.all, 'users'] as const,
  user: (id: string) => [...adminQueryKeys.all, 'users', id] as const,
  roles: () => [...adminQueryKeys.all, 'roles'] as const,
  permissions: () => [...adminQueryKeys.all, 'permissions'] as const,
  customers: () => [...adminQueryKeys.all, 'customers'] as const,
  customer: (id: string) => [...adminQueryKeys.all, 'customers', id] as const,
  products: () => [...adminQueryKeys.all, 'products'] as const,
  product: (id: string) => [...adminQueryKeys.all, 'products', id] as const,
  catalogCategories: () => [...adminQueryKeys.all, 'catalog-categories'] as const,
  catalogCategory: (id: string) =>
    [...adminQueryKeys.all, 'catalog-categories', id] as const,
  catalogBrands: () => [...adminQueryKeys.all, 'catalog-brands'] as const,
  catalogAttributes: () => [...adminQueryKeys.all, 'catalog-attributes'] as const,
  inventoryWarehouses: () => [...adminQueryKeys.all, 'inventory-warehouses'] as const,
  inventoryStock: () => [...adminQueryKeys.all, 'inventory-stock'] as const,
  inventoryMovements: () => [...adminQueryKeys.all, 'inventory-movements'] as const,
  inventoryReservations: () => [...adminQueryKeys.all, 'inventory-reservations'] as const,
  settingsCompany: () => [...adminQueryKeys.all, 'settings-company'] as const,
  settingsStore: () => [...adminQueryKeys.all, 'settings-store'] as const,
  settingsCurrencies: () => [...adminQueryKeys.all, 'settings-currencies'] as const,
  settingsTaxes: () => [...adminQueryKeys.all, 'settings-taxes'] as const,
  settingsActiveCurrencies: () =>
    [...adminQueryKeys.all, 'settings-currencies', 'active'] as const,
  settingsActiveTaxes: () => [...adminQueryKeys.all, 'settings-taxes', 'active'] as const,
  inventoryActiveWarehouses: () =>
    [...adminQueryKeys.all, 'inventory-warehouses', 'active'] as const,
  orders: () => [...adminQueryKeys.all, 'orders'] as const,
  order: (id: string) => [...adminQueryKeys.all, 'orders', id] as const,
}
