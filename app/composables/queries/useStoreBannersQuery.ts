import { useQuery } from '@tanstack/vue-query'
import { fetchStoreBanners } from '~/api/store-marketing.api'
import { storeQueryKeys } from '~/constants/query-keys'
import type { StoreBanner, StoreBannerPlacement } from '~/types/store'

export function useStoreBannersQuery(
  placement: MaybeRefOrGetter<StoreBannerPlacement> = 'HOME_HERO',
) {
  const resolvedPlacement = computed(() => toValue(placement))

  return useQuery<StoreBanner[]>({
    queryKey: computed(() => storeQueryKeys.banners(resolvedPlacement.value)),
    queryFn: (): Promise<StoreBanner[]> =>
      fetchStoreBanners(resolvedPlacement.value),
    staleTime: 60 * 1000,
  })
}
