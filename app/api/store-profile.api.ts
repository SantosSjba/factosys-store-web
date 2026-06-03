import type { StoreProfile } from '~/types/auth'

export async function fetchStoreProfile() {
  const { data } = await useApi().get<StoreProfile>('/store/me')
  return data
}
