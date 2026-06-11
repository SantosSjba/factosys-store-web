<script setup lang="ts">
import type { StoreCategoryNode } from '~/types/store'
import { findCategoryBySlug } from '~/utils/store/category-tree'

const props = defineProps<{
  categories: StoreCategoryNode[]
  activeSlug?: string
  onNavigate?: () => void
}>()

const expandedIds = ref<Set<string>>(new Set())

function hasActiveChild(node: StoreCategoryNode): boolean {
  if (!props.activeSlug) return false
  if (node.slug === props.activeSlug) return true
  return node.children.some(hasActiveChild)
}

function toggleExpanded(id: string) {
  const next = new Set(expandedIds.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  expandedIds.value = next
}

function expandAncestors(slug: string) {
  const next = new Set<string>()

  const walk = (nodes: StoreCategoryNode[], ancestors: string[]): boolean => {
    for (const node of nodes) {
      const chain = [...ancestors, node.id]
      if (node.slug === slug) {
        for (const ancestorId of ancestors) {
          next.add(ancestorId)
        }
        return true
      }
      if (walk(node.children, chain)) {
        for (const ancestorId of ancestors) {
          next.add(ancestorId)
        }
        return true
      }
    }
    return false
  }

  walk(props.categories, [])
  expandedIds.value = next
}

watch(
  () => [props.categories, props.activeSlug] as const,
  () => {
    if (!props.activeSlug) {
      expandedIds.value = new Set()
      return
    }

    if (findCategoryBySlug(props.categories, props.activeSlug)) {
      expandAncestors(props.activeSlug)
      return
    }

    const next = new Set<string>()
    for (const category of props.categories) {
      if (category.children.length > 0 && hasActiveChild(category)) {
        next.add(category.id)
      }
    }
    expandedIds.value = next
  },
  { immediate: true },
)
</script>

<template>
  <ul class="space-y-1">
    <StoreCategoryMenuNode
      v-for="category in categories"
      :key="category.id"
      :node="category"
      :active-slug="activeSlug"
      :expanded-ids="expandedIds"
      :on-navigate="onNavigate"
      @toggle-expanded="toggleExpanded"
    />
  </ul>
</template>
