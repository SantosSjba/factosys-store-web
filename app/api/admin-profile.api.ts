import type { AdminProfile } from '~/types/auth'

export async function fetchAdminProfile() {
  const { data } = await useAdminApi().get<AdminProfile>('/admin/users/me')
  return data
}
