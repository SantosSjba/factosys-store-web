<script setup lang="ts">
import type { CatalogProductVariant } from '~/types/admin-catalog'
import { getVariantDisplayPrice, getVariantLabel } from '~/utils/store/product'

const props = defineProps<{
  variants: CatalogProductVariant[]
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [variantId: string]
}>()

const { data: settings } = useStoreSettingsQuery()

const priceFormatter = computed(
  () =>
    new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: settings.value?.currency.code ?? 'PEN',
    }),
)

function selectVariant(variantId: string) {
  emit('update:modelValue', variantId)
}

function formatVariantPrice(variant: CatalogProductVariant) {
  return priceFormatter.value.format(getVariantDisplayPrice(variant).price)
}
</script>

<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between gap-3">
      <p class="text-theme text-sm font-semibold">
        Opciones disponibles
      </p>
      <p class="text-theme-muted text-xs">
        {{ variants.length }} opciones
      </p>
    </div>

    <div
      class="flex flex-wrap gap-2"
      role="listbox"
      aria-label="Seleccionar variante"
    >
      <button
        v-for="variant in variants"
        :key="variant.id"
        type="button"
        role="option"
        class="border-theme bg-theme-surface hover:border-brand-accent min-w-[5.5rem] rounded-xl border px-3 py-2 text-left transition focus:outline-none focus:ring-2 focus:ring-[var(--brand-cyan)]"
        :class="
          modelValue === variant.id
            ? 'border-brand-accent ring-2 ring-[color-mix(in_srgb,var(--brand-cyan)_25%,transparent)]'
            : ''
        "
        :aria-selected="modelValue === variant.id"
        @click="selectVariant(variant.id)"
      >
        <span class="text-theme block text-sm font-medium leading-snug">
          {{ getVariantLabel(variant) }}
        </span>
        <span class="text-theme-muted mt-0.5 block text-xs">
          {{ formatVariantPrice(variant) }}
        </span>
      </button>
    </div>
  </div>
</template>
