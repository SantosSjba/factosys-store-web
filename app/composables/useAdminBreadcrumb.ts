import type { BreadcrumbItem } from '~/types/ui'

export function useAdminBreadcrumb() {
  const route = useRoute()

  return computed<BreadcrumbItem[]>(() => {
    const custom = route.meta.adminBreadcrumb
    if (Array.isArray(custom) && custom.length > 0) {
      return custom
    }

    const title = route.meta.adminTitle
    if (typeof title !== 'string' || route.path === '/intranet') {
      return [{ label: 'Panel' }]
    }

    return [
      { label: 'Panel', to: '/intranet' },
      { label: title },
    ]
  })
}
