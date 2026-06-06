import type {
  PermissionCatalogItem,
  StaffRole,
  UpdateRolePermissionsPayload,
} from '~/types/admin-users'

export async function fetchAdminStaffRoles() {
  const { data } = await useAdminApi().get<StaffRole[]>('/admin/roles')
  return data
}

export async function fetchAdminPermissions() {
  const { data } = await useAdminApi().get<PermissionCatalogItem[]>(
    '/admin/permissions',
  )
  return data
}

export async function updateAdminRolePermissions(
  slug: string,
  payload: UpdateRolePermissionsPayload,
) {
  const { data } = await useAdminApi().patch<StaffRole>(
    `/admin/roles/${slug}/permissions`,
    payload,
  )
  return data
}
