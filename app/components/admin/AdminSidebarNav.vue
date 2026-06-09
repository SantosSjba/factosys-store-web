<script setup lang="ts">
const { menu: adminNavMenu } = useAdminNavMenu()

defineProps<{
  collapsed?: boolean
}>()

const emit = defineEmits<{
  navigate: []
}>()

const expandedGroups = ref<Record<string, boolean>>({
  Gestión: true,
  Marketing: true,
  Sistema: true,
})

function toggleGroup(label: string) {
  expandedGroups.value[label] = !expandedGroups.value[label]
}
</script>

<template>
  <nav
    class="min-h-0 flex-1 overflow-y-auto overflow-x-visible p-4"
    :class="collapsed ? 'space-y-1' : 'space-y-6'"
    aria-label="Menú administración"
  >
    <template v-for="entry in adminNavMenu" :key="entry.type === 'link' ? entry.to : entry.label">
      <AdminSidebarLink
        v-if="entry.type === 'link'"
        :to="entry.to"
        :label="entry.label"
        :icon="entry.icon"
        :soon="entry.soon"
        :collapsed="collapsed"
        @navigate="emit('navigate')"
      />

      <div v-else>
        <button
          v-if="!collapsed"
          type="button"
          class="mb-2 flex w-full items-center justify-between px-3 text-xs font-semibold uppercase tracking-wider"
          style="color: var(--admin-sidebar-muted)"
          @click="toggleGroup(entry.label)"
        >
          {{ entry.label }}
          <UiIcon
            name="lucide:chevron-down"
            :size="16"
            class="transition"
            :class="expandedGroups[entry.label] ? 'rotate-180' : ''"
          />
        </button>
        <div
          v-if="collapsed"
          class="border-admin-line my-2 border-t"
          aria-hidden="true"
        />
        <div
          v-show="collapsed || expandedGroups[entry.label]"
          class="w-full space-y-1"
        >
          <AdminSidebarLink
            v-for="child in entry.children"
            :key="child.to"
            :to="child.to"
            :label="child.label"
            :icon="child.icon"
            :soon="child.soon"
            :collapsed="collapsed"
            @navigate="emit('navigate')"
          />
        </div>
      </div>
    </template>
  </nav>
</template>
