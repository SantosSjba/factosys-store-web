<script setup lang="ts">
import type { StoreCategoryNode } from '~/types/store'

const props = defineProps<{
  categories: StoreCategoryNode[]
  activeSlug?: string
  onNavigate?: () => void
}>()

const expandedIds = ref<Set<string>>(new Set())

function isActive(slug: string) {
  return props.activeSlug === slug
}

function isExpanded(id: string) {
  return expandedIds.value.has(id)
}

function toggleExpanded(id: string) {
  const next = new Set(expandedIds.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  expandedIds.value = next
}

function hasActiveChild(node: StoreCategoryNode): boolean {
  if (!props.activeSlug) return false
  if (node.slug === props.activeSlug) return true
  return node.children.some(hasActiveChild)
}

watch(
  () => [props.categories, props.activeSlug] as const,
  () => {
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
    <li v-for="category in categories" :key="category.id">
      <div class="flex items-center">
        <NuxtLink
          :to="{ path: '/productos', query: { categoria: category.slug } }"
          class="hover:bg-theme-muted flex min-h-[2.75rem] flex-1 items-center rounded-lg px-3 py-2.5 text-left font-medium transition"
          :class="isActive(category.slug) ? 'bg-theme-muted text-brand-accent' : ''"
          :aria-current="isActive(category.slug) ? 'page' : undefined"
          @click="onNavigate?.()"
        >
          {{ category.name }}
        </NuxtLink>
        <button
          v-if="category.children.length > 0"
          type="button"
          class="text-theme-muted hover:bg-theme-muted flex h-11 w-11 shrink-0 items-center justify-center rounded-lg"
          :aria-expanded="isExpanded(category.id)"
          :aria-label="`${isExpanded(category.id) ? 'Ocultar' : 'Mostrar'} subcategorías de ${category.name}`"
          @click="toggleExpanded(category.id)"
        >
          <UiIcon
            :name="isExpanded(category.id) ? 'lucide:chevron-down' : 'lucide:chevron-right'"
            :size="16"
          />
        </button>
      </div>
      <ul
        v-if="category.children.length > 0 && isExpanded(category.id)"
        class="border-theme-muted ml-3 space-y-1 border-l pl-3"
      >
        <li v-for="child in category.children" :key="child.id">
          <NuxtLink
            :to="{ path: '/productos', query: { categoria: child.slug } }"
            class="hover:bg-theme-muted block min-h-[2.5rem] rounded-lg px-3 py-2 text-left transition"
            :class="isActive(child.slug) ? 'bg-theme-muted text-brand-accent font-medium' : ''"
            :aria-current="isActive(child.slug) ? 'page' : undefined"
            @click="onNavigate?.()"
          >
            {{ child.name }}
          </NuxtLink>
        </li>
      </ul>
    </li>
  </ul>
</template>
