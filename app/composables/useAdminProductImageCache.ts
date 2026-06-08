import { useQueryClient } from '@tanstack/vue-query'
import { adminQueryKeys } from '~/constants/query-keys'
import type { CatalogProduct, CatalogProductImage } from '~/types/admin-catalog'

function resolvePrimaryImageUrl(images: CatalogProductImage[]) {
  const sorted = [...images].sort((a, b) => a.sortOrder - b.sortOrder)
  const primary = sorted.find((image) => image.isPrimary) ?? sorted[0]
  return primary?.url ?? null
}

export function useAdminProductImageCache(productId: MaybeRefOrGetter<string>) {
  const queryClient = useQueryClient()
  const id = computed(() => toValue(productId))

  function patchProduct(
    updater: (product: CatalogProduct) => CatalogProduct,
  ) {
    queryClient.setQueryData<CatalogProduct>(
      adminQueryKeys.product(id.value),
      (current) => (current ? updater(current) : current),
    )
  }

  function invalidateProductQueries() {
    queryClient.invalidateQueries({ queryKey: adminQueryKeys.product(id.value) })
    queryClient.invalidateQueries({ queryKey: adminQueryKeys.products() })
  }

  function addImage(image: CatalogProductImage) {
    patchProduct((product) => {
      const images = [...product.images, image].sort(
        (a, b) => a.sortOrder - b.sortOrder,
      )
      return {
        ...product,
        images,
        primaryImageUrl: resolvePrimaryImageUrl(images),
      }
    })
    invalidateProductQueries()
  }

  function replaceImages(images: CatalogProductImage[]) {
    const sorted = [...images].sort((a, b) => a.sortOrder - b.sortOrder)
    patchProduct((product) => ({
      ...product,
      images: sorted,
      primaryImageUrl: resolvePrimaryImageUrl(sorted),
    }))
    invalidateProductQueries()
  }

  return {
    addImage,
    replaceImages,
    invalidateProductQueries,
  }
}
