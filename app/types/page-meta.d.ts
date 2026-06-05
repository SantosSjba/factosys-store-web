import type { BreadcrumbItem } from '~/types/ui'

declare module '#app' {
  interface PageMeta {
    /** Título mostrado en la barra superior del panel admin. */
    adminTitle?: string
    /** Migas de pan del panel admin (opcional; si no se define, se genera automático). */
    adminBreadcrumb?: BreadcrumbItem[]
    /** Migas de pan de la tienda (catálogo, producto, cuenta…). */
    storeBreadcrumb?: BreadcrumbItem[]
  }
}

export {}
