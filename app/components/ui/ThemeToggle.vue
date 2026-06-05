<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: number
    variant?: 'default' | 'ghost'
  }>(),
  { size: 20, variant: 'ghost' },
)

const { isDark, toggleTheme } = useTheme()
</script>

<template>
  <button
    type="button"
    class="rounded-lg p-2 transition"
    :class="
      variant === 'ghost'
        ? 'text-theme-muted hover:bg-theme-muted hover:text-theme'
        : 'border-theme bg-theme-surface text-theme-muted hover:text-theme border'
    "
    :aria-label="isDark ? 'Activar modo claro' : 'Activar modo oscuro'"
    @click="toggleTheme"
  >
    <UiIcon :name="isDark ? 'lucide:sun' : 'lucide:moon'" :size="size" />
  </button>
</template>
