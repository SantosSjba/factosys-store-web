<script setup lang="ts">
defineProps<{
  collapsed?: boolean
}>()

const config = useRuntimeConfig()
</script>

<template>
  <div
    class="border-admin-line flex h-16 shrink-0 items-center border-b"
    :class="collapsed ? 'justify-center px-2' : 'px-5'"
  >
    <NuxtLink
      to="/intranet"
      class="min-w-0"
      :class="collapsed ? 'flex flex-col items-center leading-tight' : 'block'"
    >
      <template v-if="collapsed">
        <span class="text-brand-facto text-[11px] font-bold tracking-tight">FACTO</span>
        <span class="text-brand-sys text-[11px] font-bold tracking-tight">SYS</span>
      </template>
      <template v-else>
        <span class="flex items-baseline gap-1 font-bold tracking-tight">
          <span class="text-brand-facto text-sm">FACTO</span>
          <span class="text-brand-sys text-sm">SYS</span>
        </span>
        <p class="truncate text-xs" style="color: var(--admin-sidebar-muted)">
          Admin · {{ config.public.appName }}
        </p>
      </template>
    </NuxtLink>
  </div>
</template>
