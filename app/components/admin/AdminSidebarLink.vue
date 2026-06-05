<script setup lang="ts">
import type { AdminNavIconName } from '~/constants/admin-nav'

const props = defineProps<{
  to: string
  label: string
  icon: AdminNavIconName
  soon?: boolean
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
  <NuxtLink
    :to="to"
    class="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition"
    :class="isActive ? 'admin-nav-link--active' : 'admin-nav-link'"
    @click="emit('navigate')"
  >
    <AdminNavIcon :name="icon" />
    <span class="flex-1">{{ label }}</span>
    <AdminBadge v-if="soon">Próx.</AdminBadge>
  </NuxtLink>
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
