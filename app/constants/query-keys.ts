export const storeQueryKeys = {
  all: ['store'] as const,
  profile: () => [...storeQueryKeys.all, 'profile'] as const,
  addresses: () => [...storeQueryKeys.all, 'addresses'] as const,
  settings: () => [...storeQueryKeys.all, 'settings'] as const,
  banners: (placement = 'HOME_HERO') =>
    [...storeQueryKeys.all, 'banners', placement] as const,
  products: () => [...storeQueryKeys.all, 'products'] as const,
  product: (slug: string) => [...storeQueryKeys.all, 'products', slug] as const,
  categories: () => [...storeQueryKeys.all, 'categories'] as const,
  brands: () => [...storeQueryKeys.all, 'brands'] as const,
  catalogFilters: (params: unknown) =>
    [...storeQueryKeys.all, 'catalog-filters', params] as const,
  orders: () => [...storeQueryKeys.all, 'orders'] as const,
  order: (id: string) => [...storeQueryKeys.all, 'orders', id] as const,
  favorites: () => [...storeQueryKeys.all, 'favorites'] as const,
  favoriteIds: () => [...storeQueryKeys.all, 'favorites', 'ids'] as const,
  favoritesCount: () => [...storeQueryKeys.all, 'favorites', 'count'] as const,
  cart: () => [...storeQueryKeys.all, 'cart'] as const,
  cartCount: () => [...storeQueryKeys.all, 'cart', 'count'] as const,
  checkoutSettings: () => [...storeQueryKeys.all, 'checkout', 'settings'] as const,
  checkoutQuote: (params: unknown) =>
    [...storeQueryKeys.all, 'checkout', 'quote', params] as const,
  mercadoPagoConfig: () =>
    [...storeQueryKeys.all, 'payments', 'mercadopago', 'config'] as const,
  mercadoPagoPaymentMethods: () =>
    [...storeQueryKeys.all, 'payments', 'mercadopago', 'payment-methods'] as const,
  mercadoPagoPaymentContext: (orderId: string, email?: string) =>
    [
      ...storeQueryKeys.all,
      'payments',
      'mercadopago',
      'payment-context',
      orderId,
      email ?? '',
    ] as const,
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
  customerAddresses: (id: string) =>
    [...adminQueryKeys.all, 'customers', id, 'addresses'] as const,
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
  dashboard: () => [...adminQueryKeys.all, 'dashboard'] as const,
  coupons: () => [...adminQueryKeys.all, 'coupons'] as const,
  banners: () => [...adminQueryKeys.all, 'banners'] as const,
  campaigns: () => [...adminQueryKeys.all, 'campaigns'] as const,
  loginAudit: () => [...adminQueryKeys.all, 'login-audit'] as const,
  audit: () => [...adminQueryKeys.all, 'audit'] as const,
  media: () => [...adminQueryKeys.all, 'media'] as const,
  returns: () => [...adminQueryKeys.all, 'returns'] as const,
  return: (id: string) => [...adminQueryKeys.all, 'returns', id] as const,
  shippingZones: () => [...adminQueryKeys.all, 'shipping-zones'] as const,
  paymentGateways: () => [...adminQueryKeys.all, 'payment-gateways'] as const,
  mercadoPagoWebhookSetup: () =>
    [...adminQueryKeys.all, 'payment-gateways', 'mercadopago', 'webhook-setup'] as const,
  paymentTransactions: (orderId?: string) =>
    [...adminQueryKeys.all, 'payment-transactions', orderId ?? 'all'] as const,
  reports: () => [...adminQueryKeys.all, 'reports'] as const,
}
