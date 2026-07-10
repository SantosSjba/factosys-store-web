<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    to?: string
    size?: 'sm' | 'md'
    /** Tamaño vía CSS (sin JS) para evitar hydration mismatch en el header. */
    responsive?: boolean
  }>(),
  { to: '/', size: 'md', responsive: false },
)

const { data: settings } = useStoreSettingsQuery()

const storeName = computed(
  () => settings.value?.storeName ?? 'Factosys Store',
)

const logoUrl = computed(() => settings.value?.logoUrl)

const textSize = computed(() => {
  if (props.responsive) return 'text-base sm:text-lg'
  return props.size === 'sm' ? 'text-base sm:text-lg' : 'text-lg sm:text-xl'
})

const storeSize = computed(() => {
  if (props.responsive) return 'text-xs sm:text-sm'
  return props.size === 'sm' ? 'text-xs sm:text-sm' : 'text-sm sm:text-base'
})

const imageHeight = computed(() => {
  if (props.responsive) return 'h-8 sm:h-10'
  return props.size === 'sm' ? 'h-8 sm:h-9' : 'h-9 sm:h-10'
})
</script>

<template>
  <NuxtLink
    :to="props.to"
    class="flex shrink-0 items-center gap-2 font-bold tracking-tight"
    :aria-label="`Ir al inicio de ${storeName}`"
  >
    <StoreImage
      v-if="logoUrl"
      :src="logoUrl"
      :alt="storeName"
      :img-class="[imageHeight, 'w-auto max-w-[10rem] object-contain'].join(' ')"
      fit="contain"
      loading="eager"
    />
    <template v-else>
      <span :class="textSize">
        <span class="text-brand-facto">FACTO</span><span class="text-brand-sys">SYS</span>
      </span>
      <span class="text-theme-muted font-medium" :class="storeSize">Store</span>
    </template>
  </NuxtLink>
</template>
