<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    loading?: boolean
    label?: string
    rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
    spinnerSize?: 'sm' | 'md' | 'lg'
  }>(),
  {
    loading: false,
    rounded: 'lg',
    spinnerSize: 'sm',
  },
)

const roundedClass = computed(() => {
  const map = {
    none: '',
    sm: 'rounded',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
  }
  return map[props.rounded]
})
</script>

<template>
  <div class="relative" :class="loading ? 'overflow-hidden' : undefined">
    <slot />

    <div
      v-if="loading"
      class="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-slate-900/50 backdrop-blur-[1px]"
      :class="roundedClass"
      role="status"
      :aria-busy="true"
      :aria-label="label || 'Cargando'"
    >
      <UiSpinner :size="spinnerSize" />
      <p
        v-if="label"
        class="px-2 text-center text-[10px] font-medium uppercase tracking-wide text-white"
      >
        {{ label }}
      </p>
    </div>
  </div>
</template>
