import { formatModuleLabel } from '~/constants/admin-permissions'

export type CatalogPermission = {
  slug: string
  name: string
  module: string
}

export type PermissionModuleGroup<T extends CatalogPermission = CatalogPermission> = {
  module: string
  label: string
  permissions: T[]
}

export function groupCatalogPermissionsByModule<T extends CatalogPermission>(
  permissions: T[],
  options?: { dedupe?: boolean },
): PermissionModuleGroup<T>[] {
  const groups = new Map<string, T[]>()

  for (const permission of permissions) {
    const current = groups.get(permission.module) ?? []
    if (!options?.dedupe || !current.some((item) => item.slug === permission.slug)) {
      current.push(permission)
    }
    groups.set(permission.module, current)
  }

  return [...groups.entries()]
    .map(([module, items]) => ({
      module,
      label: formatModuleLabel(module),
      permissions: items.sort((a, b) => a.name.localeCompare(b.name)),
    }))
    .sort((a, b) => a.label.localeCompare(b.label))
}

export function groupPermissionSlugsByModule(slugs: string[]) {
  const groups = new Map<string, string[]>()

  for (const slug of slugs) {
    const module = slug.split('.')[0] ?? 'general'
    const current = groups.get(module) ?? []
    current.push(slug)
    groups.set(module, current)
  }

  return [...groups.entries()]
    .map(([module, permissions]) => ({
      module,
      label: formatModuleLabel(module),
      permissions: permissions.sort(),
    }))
    .sort((a, b) => a.label.localeCompare(b.label))
}
