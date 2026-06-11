<script setup lang="ts">
import type { StoreAccountTab } from '~/types/store-account'

const props = defineProps<{
  modelValue: StoreAccountTab
}>()

const emit = defineEmits<{
  'update:modelValue': [value: StoreAccountTab]
}>()

const tabs: Array<{
  id: StoreAccountTab
  label: string
  description: string
  icon: string
}> = [
  {
    id: 'compras',
    label: 'Mis compras',
    description: 'Revisa el estado de tus pedidos',
    icon: 'lucide:package',
  },
  {
    id: 'perfil',
    label: 'Mi perfil',
    description: 'Datos de tu cuenta',
    icon: 'lucide:user',
  },
  {
    id: 'ayuda',
    label: 'Ayuda',
    description: 'Soporte y contacto',
    icon: 'lucide:help-circle',
  },
]

function selectTab(id: StoreAccountTab) {
  emit('update:modelValue', id)
}
</script>

<template>
  <div class="grid gap-3 sm:grid-cols-3">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      type="button"
      class="border-theme bg-theme-surface rounded-2xl border p-4 text-left shadow-sm transition hover:shadow-md"
      :class="
        modelValue === tab.id
          ? 'border-[var(--brand-cyan)] ring-1 ring-[var(--brand-cyan)]'
          : 'hover:border-[color-mix(in_srgb,var(--brand-cyan)_35%,var(--color-border))]'
      "
      @click="selectTab(tab.id)"
    >
      <div
        class="mb-3 flex h-10 w-10 items-center justify-center rounded-full"
        :class="
          modelValue === tab.id
            ? 'bg-brand-accent-soft text-brand-accent'
            : 'bg-theme-muted text-theme-muted'
        "
      >
        <UiIcon :name="tab.icon" :size="20" />
      </div>
      <p class="text-theme font-semibold">{{ tab.label }}</p>
      <p class="text-theme-muted mt-1 text-xs sm:text-sm">{{ tab.description }}</p>
    </button>
  </div>
</template>
