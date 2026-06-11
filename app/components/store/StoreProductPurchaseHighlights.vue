<script setup lang="ts">
const { data: settings } = useStoreSettingsQuery()

const items = computed(() => {
  const list: Array<{ icon: string; label: string }> = []

  const min = settings.value?.freeShippingMinAmount
  const symbol = settings.value?.currency.symbol ?? 'S/'

  if (min && Number.parseFloat(min) > 0) {
    list.push({
      icon: 'lucide:truck',
      label: `Envío gratis desde ${symbol} ${min}`,
    })
  } else {
    list.push({
      icon: 'lucide:truck',
      label: 'Envíos a todo el Perú',
    })
  }

  const handlingMin = settings.value?.handlingDaysMin
  const handlingMax = settings.value?.handlingDaysMax
  if (handlingMin != null && handlingMax != null) {
    list.push({
      icon: 'lucide:package-check',
      label: `Despacho en ${handlingMin}–${handlingMax} días hábiles`,
    })
  }

  if (settings.value?.returnsPolicyUrl) {
    list.push({
      icon: 'lucide:rotate-ccw',
      label: 'Cambios y devoluciones',
    })
  }

  if (settings.value?.company.supportPhone || settings.value?.company.whatsapp) {
    list.push({
      icon: 'lucide:headphones',
      label: 'Soporte al cliente',
    })
  }

  return list.slice(0, 4)
})
</script>

<template>
  <ul
    v-if="items.length > 0"
    class="border-theme grid gap-2.5 border-t pt-5 sm:grid-cols-2"
  >
    <li
      v-for="item in items"
      :key="item.label"
      class="text-theme-muted flex items-center gap-2 text-sm"
    >
      <UiIcon :name="item.icon" :size="16" class="text-brand-accent shrink-0" />
      <span>{{ item.label }}</span>
    </li>
  </ul>
</template>
