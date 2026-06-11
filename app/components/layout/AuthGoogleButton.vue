<script setup lang="ts">
defineProps<{
  href: string
}>()
</script>

<template>
  <a
    :href="href"
    class="border-theme bg-theme-surface text-theme hover:bg-theme-muted flex w-full items-center justify-center gap-3 rounded-lg border px-4 py-2.5 text-sm font-medium shadow-sm transition"
  >
    <UiIcon name="logos:google-icon" :size="20" />
    Continuar con Google
  </a>
</template>
