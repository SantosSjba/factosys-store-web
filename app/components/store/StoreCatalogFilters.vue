<script setup lang="ts">
import type { StoreCatalogFilterGroup } from '~/types/store'
import {
  isFilterOptionActive,
  type CatalogAttributeFilters,
} from '~/utils/store/catalog-filters'

type ActiveChip = {
  key: string
  label: string
  type: 'search' | 'category' | 'brand' | 'attribute'
  attributeSlug?: string
}

const props = withDefaults(
  defineProps<{
    groups?: StoreCatalogFilterGroup[]
    loading?: boolean
    categorySlug?: string
    brandId?: string
    search?: string
    attributeFilters?: CatalogAttributeFilters
    activeChips?: ActiveChip[]
  }>(),
  {
    groups: () => [],
    loading: false,
    categorySlug: '',
    brandId: '',
    search: '',
    attributeFilters: () => ({}),
    activeChips: () => [],
  },
)

const emit = defineEmits<{
  select: [group: StoreCatalogFilterGroup, value: string]
  remove: [chip: ActiveChip]
  clear: []
}>()

const isExpanded = ref(true)

const hasGroups = computed(() => props.groups.length > 0)
const hasActiveFilters = computed(() => props.activeChips.length > 0)

const activeFilterCount = computed(() => props.activeChips.length)

const showFilterPanels = computed(() => isExpanded.value)

function toggleFiltersPanel() {
  isExpanded.value = !isExpanded.value
}

onMounted(() => {
  const mobileMedia = window.matchMedia('(max-width: 639px)')
  const optionCount = props.groups.reduce(
    (sum, group) => sum + group.options.length,
    0,
  )
  if (mobileMedia.matches && optionCount > 4) {
    isExpanded.value = false
  }
})

function pillClass(group: StoreCatalogFilterGroup, value: string) {
  const active = isFilterOptionActive(group, value, {
    categorySlug: props.categorySlug,
    brandId: props.brandId,
    attributeFilters: props.attributeFilters,
  })

  return active
    ? 'border-brand-accent bg-brand-accent-soft text-brand-accent'
    : 'border-theme bg-theme-surface text-theme hover:border-brand-accent'
}
</script>

<template>
  <div
    v-if="loading || hasGroups || hasActiveFilters"
    class="border-theme bg-theme-surface mb-6 rounded-2xl border p-3 sm:p-4"
  >
    <div class="mb-3 flex items-center justify-between gap-3">
      <div class="flex min-w-0 items-center gap-2">
        <UiIcon name="lucide:sliders-horizontal" :size="16" class="text-theme-muted shrink-0" />
        <span class="text-theme text-sm font-semibold">Filtros</span>
        <span
          v-if="activeFilterCount > 0"
          class="bg-brand-accent-soft text-brand-accent rounded-full px-2 py-0.5 text-xs font-semibold"
        >
          {{ activeFilterCount }}
        </span>
      </div>

      <div class="flex shrink-0 items-center gap-2">
        <button
          v-if="hasGroups && !loading"
          type="button"
          class="text-theme-muted hover:text-theme inline-flex items-center gap-1 text-xs font-medium sm:text-sm"
          :aria-expanded="showFilterPanels"
          @click="toggleFiltersPanel"
        >
          {{ showFilterPanels ? 'Ocultar' : 'Ver filtros' }}
          <UiIcon
            :name="showFilterPanels ? 'lucide:chevron-up' : 'lucide:chevron-down'"
            :size="14"
          />
        </button>

        <button
          v-if="hasActiveFilters"
          type="button"
          class="text-brand-accent-deep text-xs font-semibold hover:underline sm:text-sm"
          @click="emit('clear')"
        >
          Limpiar
        </button>
      </div>
    </div>

    <div v-if="hasActiveFilters" class="mb-3 flex flex-wrap gap-2">
      <button
        v-for="chip in activeChips"
        :key="chip.key"
        type="button"
        class="border-brand-accent bg-brand-accent-soft text-brand-accent inline-flex max-w-full items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium sm:text-sm"
        @click="emit('remove', chip)"
      >
        <span class="truncate">{{ chip.label }}</span>
        <UiIcon name="lucide:x" :size="14" class="shrink-0" />
      </button>
    </div>

    <div v-if="loading" class="space-y-3">
      <UiSkeleton
        v-for="index in 2"
        :key="index"
        tone="store"
        height="2rem"
        rounded="full"
      />
    </div>

    <div v-else-if="showFilterPanels && hasGroups" class="space-y-4">
      <div
        v-for="group in groups"
        :key="group.key"
        class="space-y-2"
      >
        <p class="text-theme-muted text-xs font-semibold uppercase tracking-wide">
          {{ group.label }}
        </p>
        <div class="-mx-1 overflow-hidden px-1">
          <div
            class="scrollbar-thin flex snap-x snap-mandatory gap-2 overflow-x-auto pb-1 touch-pan-x"
            role="list"
            :aria-label="group.label"
          >
            <button
              v-for="option in group.options"
              :key="`${group.key}-${option.value}`"
              type="button"
              role="listitem"
              class="shrink-0 snap-start rounded-full border px-3 py-1.5 text-sm font-medium transition sm:px-4"
              :class="pillClass(group, option.value)"
              @click="emit('select', group, option.value)"
            >
              <span>{{ option.label }}</span>
              <span
                v-if="option.count != null"
                class="text-theme-muted ml-1 text-xs font-normal"
              >
                ({{ option.count }})
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
