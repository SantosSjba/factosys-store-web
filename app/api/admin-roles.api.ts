import type {
  CreateRolePayload,
  PermissionCatalogItem,
  StaffRole,
  UpdateRolePayload,
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

export async function createAdminRole(payload: CreateRolePayload) {
  const { data } = await useAdminApi().post<StaffRole>('/admin/roles', payload)
  return data
}

export async function updateAdminRole(slug: string, payload: UpdateRolePayload) {
  const { data } = await useAdminApi().patch<StaffRole>(`/admin/roles/${slug}`, payload)
  return data
}

export async function deleteAdminRole(slug: string) {
  const { data } = await useAdminApi().delete<{ deleted: boolean }>(`/admin/roles/${slug}`)
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
