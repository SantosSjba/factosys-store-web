import type { StaffRole } from '~/types/admin-users'

export function mapRoleOptions(roles: StaffRole[]) {
  return roles.map((role) => ({
    label: role.name,
    value: role.slug,
    hint: role.description ?? undefined,
  }))
}
