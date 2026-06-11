<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    to?: string
    size?: 'sm' | 'md'
  }>(),
  { to: '/', size: 'md' },
)

const { data: settings } = useStoreSettingsQuery()

const storeName = computed(
  () => settings.value?.storeName ?? 'Factosys Store',
)

const logoUrl = computed(() => settings.value?.logoUrl)

const textSize = computed(() =>
  props.size === 'sm' ? 'text-base sm:text-lg' : 'text-lg sm:text-xl',
)

const storeSize = computed(() =>
  props.size === 'sm' ? 'text-xs sm:text-sm' : 'text-sm sm:text-base',
)

const imageHeight = computed(() =>
  props.size === 'sm' ? 'h-8 sm:h-9' : 'h-9 sm:h-10',
)
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
