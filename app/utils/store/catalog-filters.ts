export type StoreCatalogFilterOption = {
  value: string
  label: string
  count?: number
}

export type StoreCatalogFilterGroup = {
  key: string
  label: string
  type: 'category' | 'brand' | 'attribute'
  options: StoreCatalogFilterOption[]
}

export type StoreCatalogFiltersResponse = {
  groups: StoreCatalogFilterGroup[]
}

export type ListStoreCatalogFiltersParams = {
  categoryId?: string
  brandId?: string
  search?: string
  attrs?: string
}

export type CatalogAttributeFilters = Record<string, string>

export function parseCatalogAttributeFilters(
  raw?: string | string[] | null,
): CatalogAttributeFilters {
  const value = Array.isArray(raw) ? raw[0] : raw
  if (!value?.trim()) return {}

  return Object.fromEntries(
    value
      .split(',')
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const separatorIndex = part.indexOf(':')
        if (separatorIndex <= 0) return null

        const slug = part.slice(0, separatorIndex).trim()
        const attrValue = decodeURIComponent(
          part.slice(separatorIndex + 1).trim(),
        )
        if (!slug || !attrValue) return null

        return [slug, attrValue] as const
      })
      .filter((entry): entry is readonly [string, string] => entry !== null),
  )
}

export function serializeCatalogAttributeFilters(
  filters: CatalogAttributeFilters,
): string | undefined {
  const entries = Object.entries(filters).filter(([, value]) => value.trim())
  if (entries.length === 0) return undefined

  return entries
    .map(([slug, value]) => `${slug}:${encodeURIComponent(value)}`)
    .join(',')
}

export function isFilterOptionActive(
  group: StoreCatalogFilterGroup,
  value: string,
  state: {
    categorySlug?: string
    brandId?: string
    attributeFilters: CatalogAttributeFilters
  },
) {
  if (group.type === 'category') return state.categorySlug === value
  if (group.type === 'brand') return state.brandId === value
  return state.attributeFilters[group.key] === value
}
