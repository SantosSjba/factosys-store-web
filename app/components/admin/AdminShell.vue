<script setup lang="ts">
const route = useRoute()
const { mobileOpen, close } = useAdminSidebar()

watch(
  () => route.path,
  () => close(),
)
</script>

<template>
  <div class="bg-admin-surface min-h-screen">
    <AdminSidebar variant="desktop" />

    <Teleport to="body">
      <div
        v-if="mobileOpen"
        class="fixed inset-0 z-40 lg:hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Menú administración"
      >
        <button
          type="button"
          class="absolute inset-0 bg-slate-900/40"
          aria-label="Cerrar menú"
          @click="close"
        />
        <div class="absolute left-0 top-0 h-full shadow-2xl">
          <AdminSidebar variant="mobile" @navigate="close" />
        </div>
      </div>
    </Teleport>

    <div class="flex min-h-screen min-w-0 flex-col lg:pl-[17rem]">
      <AdminHeader />
      <main class="flex-1 p-4 md:p-6">
        <slot />
      </main>
    </div>
  </div>
</template>
