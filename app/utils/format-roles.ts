export type RoleLike = string | { name?: string; slug?: string }

export function formatRoleNames(roles: RoleLike[] | undefined | null): string {
  if (!roles?.length) return '—'

  return roles
    .map((role) =>
      typeof role === 'string' ? role : role.name || role.slug || '',
    )
    .filter(Boolean)
    .join(', ')
}
