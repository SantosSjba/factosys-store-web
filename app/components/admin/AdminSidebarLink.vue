<script setup lang="ts">
import { adminNavIcons, type AdminNavIconName } from '~/constants/admin-nav'

const props = defineProps<{
  to: string
  label: string
  icon: AdminNavIconName
  soon?: boolean
  collapsed?: boolean
}>()

const emit = defineEmits<{
  navigate: []
}>()

const route = useRoute()

const isActive = computed(() => {
  if (props.to === '/intranet') return route.path === '/intranet'
  return route.path.startsWith(props.to)
})
</script>

<template>
  <UiTooltip :label="label" :show="collapsed">
    <NuxtLink
      :to="to"
      class="group flex items-center rounded-lg text-sm font-medium transition"
      :class="[
        collapsed ? 'justify-center px-2 py-2.5' : 'gap-3 px-3 py-2.5',
        isActive ? 'admin-nav-link--active' : 'admin-nav-link',
      ]"
      :title="collapsed ? undefined : label"
      @click="emit('navigate')"
    >
      <UiIcon :name="adminNavIcons[icon]" :size="20" />
      <span v-if="!collapsed" class="flex-1">{{ label }}</span>
      <AdminBadge v-if="soon && !collapsed">Próx.</AdminBadge>
    </NuxtLink>
  </UiTooltip>
</template>

<style scoped>
.admin-nav-link {
  color: var(--admin-sidebar-text);
}

.admin-nav-link:hover {
  background-color: var(--admin-sidebar-hover);
  color: var(--admin-text);
}

.admin-nav-link--active {
  background-color: var(--admin-sidebar-active-bg);
  color: var(--admin-sidebar-active-text);
}
</style>
