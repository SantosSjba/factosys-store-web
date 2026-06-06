export function useAdminPermissions() {
  const { data: profile } = useAdminProfileQuery()

  const permissions = computed(() => profile.value?.permissions ?? [])

  const roleSlugs = computed(() => {
    const roles = profile.value?.roles ?? []
    return roles.map((role) =>
      typeof role === 'string' ? role : role.slug || role.name || '',
    )
  })

  const isAdmin = computed(() => roleSlugs.value.includes('admin'))

  function can(permission: string) {
    if (isAdmin.value) return true
    return permissions.value.includes(permission)
  }

  return {
    permissions,
    roleSlugs,
    isAdmin,
    can,
  }
}
