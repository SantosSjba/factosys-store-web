import type { StoreBanner, StoreBannerPlacement } from '~/types/store'

export async function fetchStoreBanners(
  placement: StoreBannerPlacement = 'HOME_HERO',
): Promise<StoreBanner[]> {
  const { data } = await useApi().get<StoreBanner[]>(
    '/store/marketing/banners',
    { params: { placement }, withAuth: false },
  )
  return data
}
