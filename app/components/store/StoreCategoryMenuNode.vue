<script setup lang="ts">
import type { StoreCategoryNode } from '~/types/store'

defineOptions({ name: 'StoreCategoryMenuNode' })

const props = defineProps<{
  node: StoreCategoryNode
  depth?: number
  activeSlug?: string
  expandedIds: Set<string>
  onNavigate?: () => void
}>()

const emit = defineEmits<{
  toggleExpanded: [id: string]
}>()

const depth = computed(() => props.depth ?? 0)

function isActive(slug: string) {
  return props.activeSlug === slug
}

function isExpanded(id: string) {
  return props.expandedIds.has(id)
}

const showChildren = computed(
  () => props.node.children.length > 0 && isExpanded(props.node.id),
)

const linkClass = computed(() =>
  depth.value === 0
    ? 'hover:bg-theme-muted flex min-h-[2.75rem] flex-1 items-center rounded-lg px-3 py-2.5 text-left font-medium transition'
    : 'hover:bg-theme-muted block min-h-[2.5rem] rounded-lg px-3 py-2 text-left transition',
)
</script>

<template>
  <li>
    <div class="flex items-center">
      <NuxtLink
        :to="{ path: '/productos', query: { categoria: node.slug } }"
        :class="[
          linkClass,
          isActive(node.slug)
            ? 'bg-theme-muted text-brand-accent font-medium'
            : '',
        ]"
        :aria-current="isActive(node.slug) ? 'page' : undefined"
        @click="onNavigate?.()"
      >
        {{ node.name }}
      </NuxtLink>
      <button
        v-if="node.children.length > 0"
        type="button"
        class="text-theme-muted hover:bg-theme-muted flex h-11 w-11 shrink-0 items-center justify-center rounded-lg"
        :aria-expanded="isExpanded(node.id)"
        :aria-label="`${isExpanded(node.id) ? 'Ocultar' : 'Mostrar'} subcategorías de ${node.name}`"
        @click="emit('toggleExpanded', node.id)"
      >
        <UiIcon
          :name="isExpanded(node.id) ? 'lucide:chevron-down' : 'lucide:chevron-right'"
          :size="16"
        />
      </button>
    </div>
    <ul
      v-if="showChildren"
      class="border-theme-muted ml-3 space-y-1 border-l pl-3"
    >
      <StoreCategoryMenuNode
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :depth="depth + 1"
        :active-slug="activeSlug"
        :expanded-ids="expandedIds"
        :on-navigate="onNavigate"
        @toggle-expanded="emit('toggleExpanded', $event)"
      />
    </ul>
  </li>
</template>
