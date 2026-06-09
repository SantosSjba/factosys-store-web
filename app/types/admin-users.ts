export type StaffUserStatus = 'PENDING_VERIFICATION' | 'ACTIVE' | 'SUSPENDED'

export type StaffRoleRef = {
  slug: string
  name: string
}

export type StaffUser = {
  id: string
  email: string
  userType: 'STAFF'
  status: StaffUserStatus
  firstName: string | null
  lastName: string | null
  phone: string | null
  roles: StaffRoleRef[]
  permissions: string[]
  createdAt: string
}

export type StaffRolePermission = {
  slug: string
  name: string
  module: string
}

export type StaffRole = {
  id: string
  name: string
  slug: string
  description: string | null
  userType: 'STAFF'
  isSystem: boolean
  permissions: StaffRolePermission[]
}

export type CreateStaffUserPayload = {
  email: string
  password: string
  firstName?: string
  lastName?: string
  phone?: string
  roleSlugs: string[]
}

export type UpdateStaffUserPayload = {
  firstName?: string
  lastName?: string
  phone?: string
  status?: StaffUserStatus
  password?: string
  roleSlugs?: string[]
}

export type PermissionCatalogItem = {
  id: string
  slug: string
  name: string
  module: string
  description: string | null
}

export type UpdateRolePermissionsPayload = {
  permissionSlugs: string[]
}

export type CreateRolePayload = {
  name: string
  slug: string
  description?: string
  permissionSlugs: string[]
}

export type UpdateRolePayload = {
  name?: string
  description?: string
}
