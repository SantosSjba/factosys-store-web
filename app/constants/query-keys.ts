export const storeQueryKeys = {
  all: ['store'] as const,
  profile: () => [...storeQueryKeys.all, 'profile'] as const,
}

export const adminQueryKeys = {
  all: ['admin'] as const,
  profile: () => [...adminQueryKeys.all, 'profile'] as const,
}
