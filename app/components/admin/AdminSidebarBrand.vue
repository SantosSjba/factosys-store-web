<script setup lang="ts">
import { adminNavIcons } from '~/constants/admin-nav'

defineProps<{
  collapsed?: boolean
}>()

const config = useRuntimeConfig()
</script>

<template>
  <div
    class="border-admin-line flex h-16 items-center border-b transition-all"
    :class="collapsed ? 'justify-center px-2' : 'gap-3 px-5'"
  >
    <div
      class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
      style="background: var(--admin-primary-soft); color: var(--admin-primary)"
    >
      <UiIcon :name="adminNavIcons.dashboard" :size="20" />
    </div>
    <div v-if="!collapsed" class="min-w-0">
      <NuxtLink to="/intranet" class="flex items-baseline gap-1 font-bold tracking-tight">
        <span class="text-brand-facto text-sm">FACTO</span>
        <span class="text-brand-sys text-sm">SYS</span>
      </NuxtLink>
      <p class="truncate text-xs" style="color: var(--admin-sidebar-muted)">
        Admin · {{ config.public.appName }}
      </p>
    </div>
  </div>
</template>
