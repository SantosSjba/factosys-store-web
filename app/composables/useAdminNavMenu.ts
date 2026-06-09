import { adminNavMenu, type AdminNavEntry } from '~/constants/admin-nav'

export function useAdminNavMenu() {
  const { can } = useAdminPermissions()

  const menu = computed<AdminNavEntry[]>(() => {
    const filterLink = <T extends { permission?: string }>(item: T) =>
      !item.permission || can(item.permission)

    return adminNavMenu
      .map((entry) => {
        if (entry.type === 'link') {
          return filterLink(entry) ? entry : null
        }

        const children = entry.children.filter(filterLink)
        if (!children.length) return null

        return { ...entry, children }
      })
      .filter((entry): entry is AdminNavEntry => entry !== null)
  })

  return { menu }
}
