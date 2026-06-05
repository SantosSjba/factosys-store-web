<script setup lang="ts">
import { adminNavMenu } from '~/constants/admin-nav'

const emit = defineEmits<{
  navigate: []
}>()

const expandedGroups = ref<Record<string, boolean>>({
  Gestión: true,
  Sistema: true,
})

function toggleGroup(label: string) {
  expandedGroups.value[label] = !expandedGroups.value[label]
}
</script>

<template>
  <nav class="flex-1 space-y-6 overflow-y-auto p-4" aria-label="Menú administración">
    <template v-for="entry in adminNavMenu" :key="entry.type === 'link' ? entry.to : entry.label">
      <AdminSidebarLink
        v-if="entry.type === 'link'"
        :to="entry.to"
        :label="entry.label"
        :icon="entry.icon"
        :soon="entry.soon"
        @navigate="emit('navigate')"
      />

      <div v-else>
        <button
          type="button"
          class="mb-2 flex w-full items-center justify-between px-3 text-xs font-semibold uppercase tracking-wider"
          style="color: var(--admin-sidebar-muted)"
          @click="toggleGroup(entry.label)"
        >
          {{ entry.label }}
          <svg
            class="h-4 w-4 transition"
            :class="expandedGroups[entry.label] ? 'rotate-180' : ''"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path stroke-linecap="round" d="m6 9 6 6 6-6" />
          </svg>
        </button>
        <div v-show="expandedGroups[entry.label]" class="space-y-1">
          <AdminSidebarLink
            v-for="child in entry.children"
            :key="child.to"
            :to="child.to"
            :label="child.label"
            :icon="child.icon"
            :soon="child.soon"
            @navigate="emit('navigate')"
          />
        </div>
      </div>
    </template>
  </nav>
</template>
