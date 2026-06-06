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
  catalogBrands: () => [...adminQueryKeys.all, 'catalog-brands'] as const,
  catalogAttributes: () => [...adminQueryKeys.all, 'catalog-attributes'] as const,
}
