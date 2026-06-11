<script setup lang="ts">
const { data: settings } = useStoreSettingsQuery()

const items = computed(() => {
  const list: Array<{ icon: string; label: string }> = []

  list.push({
    icon: 'lucide:map-pin',
    label: 'Envíos a Lima y provincias',
  })

  const min = settings.value?.handlingDaysMin
  const max = settings.value?.handlingDaysMax
  if (min != null && max != null) {
    list.push({
      icon: 'lucide:zap',
      label: `Despacho en ${min}–${max} días hábiles`,
    })
  } else {
    list.push({
      icon: 'lucide:zap',
      label: 'Despacho rápido',
    })
  }

  const freeMin = settings.value?.freeShippingMinAmount
  const symbol = settings.value?.currency.symbol ?? 'S/'
  if (freeMin && Number.parseFloat(freeMin) > 0) {
    list.push({
      icon: 'lucide:truck',
      label: `Envío gratis desde ${symbol} ${freeMin}`,
    })
  }

  if (settings.value?.company.whatsapp) {
    list.push({
      icon: 'lucide:message-circle',
      label: 'Compra asistida por WhatsApp',
    })
  }

  list.push({
    icon: 'lucide:shield-check',
    label: 'Compra segura',
  })

  return list
})
</script>

<template>
  <section class="border-theme bg-theme-surface border-b">
    <div class="mx-auto max-w-7xl px-4 py-3">
      <div class="flex gap-2 overflow-x-auto pb-0.5 sm:gap-3">
        <div
          v-for="item in items"
          :key="item.label"
          class="bg-theme-muted text-theme flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium sm:px-4 sm:py-2 sm:text-sm"
        >
          <UiIcon :name="item.icon" :size="16" class="text-brand-accent shrink-0" />
          <span class="whitespace-nowrap">{{ item.label }}</span>
        </div>
      </div>
    </div>
  </section>
</template>
