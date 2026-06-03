import type { StoreProfile } from '~/types/auth'

export async function fetchAdminProfile() {
  const { data } = await useAdminApi().get<StoreProfile>('/admin/users/me')
  return data
}
