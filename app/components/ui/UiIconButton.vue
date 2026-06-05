<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    icon: string
    ariaLabel: string
    type?: 'button' | 'submit'
    size?: 'sm' | 'md' | 'lg'
    variant?: 'ghost' | 'round-dark'
    badge?: string | number
  }>(),
  {
    type: 'button',
    size: 'md',
    variant: 'ghost',
  },
)

const sizeClass = computed(() => {
  if (props.size === 'sm') return 'p-1.5'
  if (props.size === 'lg') return 'p-2.5'
  return 'p-2'
})

const iconSize = computed(() => {
  if (props.size === 'sm') return 18
  if (props.size === 'lg') return 24
  return 20
})
</script>

<template>
  <button
    :type="props.type"
    class="relative inline-flex shrink-0 items-center justify-center rounded-lg transition focus:outline-none focus:ring-2 focus:ring-[var(--brand-cyan)] focus:ring-offset-1"
    :class="[
      sizeClass,
      props.variant === 'ghost'
        ? 'text-theme hover:bg-theme-muted'
        : 'bg-brand-ink-btn h-10 w-10 rounded-full text-white sm:mr-1',
    ]"
    :aria-label="props.ariaLabel"
  >
    <UiIcon :name="props.icon" :size="iconSize" />
    <span
      v-if="props.badge !== undefined"
      class="bg-brand-accent absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white"
    >
      {{ props.badge }}
    </span>
  </button>
</template>
