import type { StorePublicSettings } from '~/types/store'

export async function fetchStorePublicSettings(): Promise<StorePublicSettings> {
  const { data } = await useApi().get<StorePublicSettings>(
    '/store/settings/public',
    { withAuth: false },
  )
  return data
}
