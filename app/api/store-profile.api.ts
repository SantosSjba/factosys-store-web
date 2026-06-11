import type { StoreProfile, UpdateStoreProfilePayload } from '~/types/auth'
import type { CustomerSavedAddress } from '~/types/admin-customers'

export async function fetchStoreProfile() {
  const { data } = await useApi().get<StoreProfile>('/store/me')
  return data
}

export async function updateStoreProfile(payload: UpdateStoreProfilePayload) {
  const { data } = await useApi().patch<StoreProfile>('/store/me', payload)
  return data
}

export async function fetchStoreAddresses() {
  const { data } = await useApi().get<CustomerSavedAddress[]>('/store/me/addresses')
  return data
}
