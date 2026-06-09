import type { BannerPlacement } from '~/types/admin-banners'

export function formatBannerPlacement(placement: BannerPlacement) {
  const labels: Record<BannerPlacement, string> = {
    HOME_HERO: 'Home principal',
    HOME_SECONDARY: 'Home secundario',
    CATEGORY_TOP: 'Categoría',
  }
  return labels[placement] ?? placement
}
