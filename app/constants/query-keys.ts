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
}
