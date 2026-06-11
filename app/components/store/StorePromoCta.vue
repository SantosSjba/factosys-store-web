<script setup lang="ts">
const { data: settings } = useStoreSettingsQuery()

const storeName = computed(
  () => settings.value?.storeName ?? 'Factosys Store',
)

const headline = computed(() => {
  const min = settings.value?.freeShippingMinAmount
  const symbol = settings.value?.currency.symbol ?? 'S/'
  if (min && Number.parseFloat(min) > 0) {
    return `Envío gratis desde ${symbol} ${min}`
  }
  return 'Compra desde Lima o provincia con un solo clic'
})

const subline = computed(() => {
  const min = settings.value?.handlingDaysMin
  const max = settings.value?.handlingDaysMax
  const delivery =
    min != null && max != null
      ? `Despacho en ${min}–${max} días hábiles a todo el Perú. `
      : 'Envíos a nivel nacional. '
  return (
    delivery +
    (settings.value?.storeTagline ||
      `Las mejores ofertas en tecnología en ${storeName.value}.`)
  )
})
</script>

<template>
  <section class="border-theme bg-store-promo-bar border-y">
    <div
      class="mx-auto flex max-w-7xl flex-col items-start justify-between gap-5 px-4 py-8 sm:flex-row sm:items-center sm:py-10"
    >
      <div class="max-w-2xl">
        <p class="text-store-promo-bar text-xs font-semibold uppercase tracking-wider">
          Compra online en Perú
        </p>
        <h2 class="text-store-promo-bar mt-1 text-xl font-bold sm:text-2xl">
          {{ headline }}
        </h2>
        <p class="text-store-promo-bar/90 mt-2 text-sm leading-relaxed sm:text-base">
          {{ subline }}
        </p>
      </div>
      <NuxtLink to="/productos" class="w-full sm:w-auto">
        <UiButton class="w-full sm:w-auto">
          Ir al catálogo
        </UiButton>
      </NuxtLink>
    </div>
  </section>
</template>
