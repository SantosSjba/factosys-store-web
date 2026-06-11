<script setup lang="ts">
import type { StoreCategoryNode } from '~/types/store'

const props = defineProps<{
  categories: StoreCategoryNode[]
  loading?: boolean
  limit?: number
}>()

const displayCategories = computed(() =>
  props.categories.slice(0, props.limit ?? 8),
)

const categoryIcons = [
  'lucide:laptop',
  'lucide:smartphone',
  'lucide:monitor',
  'lucide:keyboard',
  'lucide:hard-drive',
  'lucide:cpu',
  'lucide:headphones',
  'lucide:gamepad-2',
]
</script>

<template>
  <StoreHomeSection
    title="Compra por categoría"
    description="Encuentra lo que necesitas en pocos clics"
    action-label="Ver catálogo completo"
    action-to="/productos"
  >
    <div
      v-if="loading"
      class="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8"
    >
      <UiSkeleton
        v-for="index in 8"
        :key="index"
        tone="store"
        height="7rem"
        rounded="lg"
      />
    </div>

    <div
      v-else-if="displayCategories.length > 0"
      class="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8"
    >
      <NuxtLink
        v-for="(category, index) in displayCategories"
        :key="category.id"
        :to="{ path: '/productos', query: { categoria: category.slug } }"
        class="border-theme bg-theme-surface group overflow-hidden rounded-xl border text-center shadow-sm transition hover:border-[var(--brand-cyan)] hover:shadow-md"
      >
        <div class="bg-theme-muted relative aspect-square overflow-hidden">
          <StoreImage
            v-if="category.imageUrl"
            :src="category.imageUrl"
            :alt="category.name"
            img-class="motion-safe:transition h-full w-full object-cover motion-safe:group-hover:scale-105"
            sizes="(max-width: 640px) 25vw, 12vw"
          />
          <div
            v-else
            class="text-brand-accent flex h-full flex-col items-center justify-center gap-2 p-3"
          >
            <UiIcon
              :name="categoryIcons[index % categoryIcons.length] ?? 'lucide:folder'"
              :size="28"
            />
          </div>
        </div>
        <p class="text-theme line-clamp-2 px-2 py-2.5 text-xs font-semibold sm:text-sm">
          {{ category.name }}
        </p>
      </NuxtLink>
    </div>
  </StoreHomeSection>
</template>
