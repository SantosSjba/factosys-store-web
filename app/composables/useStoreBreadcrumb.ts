import type { BreadcrumbItem } from '~/types/ui'

export function useStoreBreadcrumb() {
  const route = useRoute()

  return computed<BreadcrumbItem[]>(() => {
    const custom = route.meta.storeBreadcrumb
    if (Array.isArray(custom) && custom.length > 0) {
      return custom
    }

    return [{ label: 'Inicio', to: '/' }]
  })
}
