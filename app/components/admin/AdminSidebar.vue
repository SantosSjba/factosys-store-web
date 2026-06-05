<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'desktop' | 'mobile'
  }>(),
  { variant: 'desktop' },
)

const emit = defineEmits<{
  navigate: []
}>()
</script>

<template>
  <aside
    class="bg-admin-sidebar border-admin-line flex w-[17rem] shrink-0 flex-col border-r"
    :class="
      variant === 'mobile'
        ? 'h-full'
        : 'fixed inset-y-0 left-0 z-30 hidden h-screen lg:flex'
    "
  >
    <AdminSidebarBrand />
    <AdminSidebarNav @navigate="emit('navigate')" />
    <div class="border-admin-line border-t p-4">
      <NuxtLink
        to="/"
        class="flex items-center gap-2 text-sm transition hover:opacity-80"
        style="color: var(--admin-sidebar-muted)"
        @click="emit('navigate')"
      >
        ← Volver a la tienda
      </NuxtLink>
    </div>
  </aside>
</template>
