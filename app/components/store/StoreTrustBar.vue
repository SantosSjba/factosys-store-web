<script setup lang="ts">
const { data: settings } = useStoreSettingsQuery()

const items = computed(() => {
  const list: Array<{ icon: string; title: string; description: string }> = []

  const min = settings.value?.freeShippingMinAmount
  if (min && Number.parseFloat(min) > 0) {
    const symbol = settings.value?.currency.symbol ?? 'S/'
    list.push({
      icon: 'lucide:truck',
      title: 'Envío gratis',
      description: `En compras desde ${symbol} ${min}`,
    })
  } else {
    list.push({
      icon: 'lucide:truck',
      title: 'Envíos a todo el Perú',
      description: 'Entrega segura a tu domicilio',
    })
  }

  const handlingMin = settings.value?.handlingDaysMin
  const handlingMax = settings.value?.handlingDaysMax
  if (handlingMin != null && handlingMax != null) {
    list.push({
      icon: 'lucide:package',
      title: 'Despacho rápido',
      description: `${handlingMin}–${handlingMax} días hábiles`,
    })
  }

  if (settings.value?.returnsPolicyUrl) {
    list.push({
      icon: 'lucide:rotate-ccw',
      title: 'Cambios y devoluciones',
      description: 'Consulta nuestra política',
    })
  }

  if (settings.value?.company.supportPhone || settings.value?.company.whatsapp) {
    list.push({
      icon: 'lucide:headphones',
      title: 'Soporte',
      description:
        settings.value.company.supportPhone ||
        settings.value.company.whatsapp ||
        'Atención al cliente',
    })
  }

  return list.slice(0, 4)
})
</script>

<template>
  <section
    v-if="items.length > 0"
    class="border-theme bg-theme-muted border-y"
  >
    <div class="mx-auto grid max-w-7xl gap-4 px-4 py-6 sm:grid-cols-2 lg:grid-cols-4 lg:py-8">
      <div
        v-for="item in items"
        :key="item.title"
        class="flex items-start gap-3"
      >
        <div
          class="bg-brand-accent-soft text-brand-accent flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
        >
          <UiIcon :name="item.icon" :size="20" />
        </div>
        <div class="min-w-0">
          <p class="text-theme text-sm font-semibold">{{ item.title }}</p>
          <p class="text-theme-muted mt-0.5 text-xs leading-relaxed sm:text-sm">
            {{ item.description }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
