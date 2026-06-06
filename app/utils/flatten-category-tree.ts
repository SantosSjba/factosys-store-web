import type { CatalogCategoryNode } from '~/types/admin-catalog'

export type FlatCategoryOption = {
  id: string
  name: string
  slug: string
  depth: number
  parentId: string | null
}

export function flattenCategoryTree(
  nodes: CatalogCategoryNode[],
  depth = 0,
): FlatCategoryOption[] {
  return nodes.flatMap((node) => [
    {
      id: node.id,
      name: node.name,
      slug: node.slug,
      depth,
      parentId: node.parentId,
    },
    ...flattenCategoryTree(node.children, depth + 1),
  ])
}

export function categorySelectOptions(
  flat: FlatCategoryOption[],
  excludeId?: string,
) {
  return [
    { label: 'Sin categoría padre (raíz)', value: '' },
    ...flat
      .filter((item) => item.id !== excludeId)
      .map((item) => ({
        label: `${'— '.repeat(item.depth)}${item.name}`,
        value: item.id,
      })),
  ]
}
