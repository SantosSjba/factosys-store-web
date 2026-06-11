import type { StoreCategoryNode } from '~/types/store'

export function findCategoryBySlug(
  nodes: StoreCategoryNode[],
  slug: string,
): StoreCategoryNode | undefined {
  for (const node of nodes) {
    if (node.slug === slug) return node
    const childMatch = findCategoryBySlug(node.children, slug)
    if (childMatch) return childMatch
  }
  return undefined
}

export function collectDescendantCategoryIds(
  node: StoreCategoryNode,
): string[] {
  const ids = [node.id]
  for (const child of node.children) {
    ids.push(...collectDescendantCategoryIds(child))
  }
  return ids
}
