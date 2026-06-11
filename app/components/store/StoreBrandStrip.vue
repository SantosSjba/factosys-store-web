<script setup lang="ts">
import type { CatalogBrand } from '~/types/admin-catalog'

defineProps<{
  brands: CatalogBrand[]
  loading?: boolean
}>()
</script>

<template>
  <StoreHomeSection
    v-if="loading || brands.length > 0"
    title="Marcas destacadas"
    description="Tecnología de las marcas que confías"
    action-label="Ver todas"
    action-to="/productos"
    muted
  >
    <div
      v-if="loading"
      class="flex gap-3 overflow-hidden"
    >
      <UiSkeleton
        v-for="index in 6"
        :key="index"
        tone="store"
        height="5rem"
        width="7rem"
        rounded="lg"
      />
    </div>

    <div
      v-else
      class="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 sm:gap-4"
    >
      <NuxtLink
        v-for="brand in brands"
        :key="brand.id"
        :to="{ path: '/productos', query: { marca: brand.id } }"
        class="border-theme bg-theme-surface hover:border-brand-accent flex h-20 w-28 shrink-0 items-center justify-center rounded-xl border p-3 shadow-sm transition hover:shadow-md sm:h-24 sm:w-32"
        :title="brand.name"
      >
        <StoreImage
          v-if="brand.logoUrl"
          :src="brand.logoUrl"
          :alt="brand.name"
          fit="contain"
          img-class="max-h-full max-w-full"
          sizes="120px"
        />
        <span
          v-else
          class="text-theme line-clamp-2 text-center text-xs font-semibold sm:text-sm"
        >
          {{ brand.name }}
        </span>
      </NuxtLink>
    </div>
  </StoreHomeSection>
</template>
