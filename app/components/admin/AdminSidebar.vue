<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    variant?: 'desktop' | 'mobile'
  }>(),
  { variant: 'desktop' },
)

const emit = defineEmits<{
  navigate: []
}>()

const { collapsed, sidebarWidthClass } = useAdminSidebar()

const isCollapsed = computed(() => props.variant === 'desktop' && collapsed.value)
</script>

<template>
  <aside
    class="bg-admin-sidebar border-admin-line flex shrink-0 flex-col overflow-visible border-r transition-[width] duration-200"
    :class="[
      props.variant === 'mobile'
        ? 'h-full w-[17rem]'
        : ['fixed inset-y-0 left-0 z-30 hidden h-screen lg:flex', sidebarWidthClass],
    ]"
  >
    <AdminSidebarBrand :collapsed="isCollapsed" />
    <AdminSidebarNav :collapsed="isCollapsed" @navigate="emit('navigate')" />

    <div class="border-admin-line overflow-visible border-t p-4">
      <UiTooltip label="Volver a la tienda" :show="isCollapsed">
        <NuxtLink
          to="/"
          class="admin-nav-link flex w-full items-center rounded-lg text-sm font-medium transition"
          :class="
            isCollapsed ? 'justify-center px-2 py-2.5' : 'gap-3 px-3 py-2.5'
          "
          @click="emit('navigate')"
        >
          <UiIcon name="lucide:store" :size="20" />
          <span v-if="!isCollapsed" class="flex-1">Volver a la tienda</span>
        </NuxtLink>
      </UiTooltip>
    </div>
  </aside>
</template>

<style scoped>
.admin-nav-link {
  color: var(--admin-sidebar-muted);
}

.admin-nav-link:hover {
  background-color: var(--admin-sidebar-hover);
  color: var(--admin-text);
}
</style>
