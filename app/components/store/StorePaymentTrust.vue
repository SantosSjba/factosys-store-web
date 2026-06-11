<script setup lang="ts">
const paymentMethods = [
  { icon: 'lucide:smartphone', label: 'Yape' },
  { icon: 'lucide:smartphone', label: 'Plin' },
  { icon: 'lucide:credit-card', label: 'Tarjetas' },
  { icon: 'lucide:landmark', label: 'Transferencia' },
]
</script>

<template>
  <section class="border-theme bg-theme-surface border-t">
    <div class="mx-auto max-w-7xl px-4 py-6 sm:py-8">
      <div class="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p class="text-theme text-sm font-semibold sm:text-base">
            Pagos pensados para el Perú
          </p>
          <p class="text-theme-muted mt-1 text-xs sm:text-sm">
            Métodos rápidos y seguros al momento de tu compra
          </p>
        </div>
        <div class="flex flex-wrap items-center justify-center gap-2 sm:justify-end">
          <span
            v-for="method in paymentMethods"
            :key="method.label"
            class="border-theme bg-theme-muted text-theme inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium"
          >
            <UiIcon :name="method.icon" :size="14" class="text-brand-accent" />
            {{ method.label }}
          </span>
        </div>
      </div>
      <p class="text-theme-muted mt-4 flex items-center justify-center gap-2 text-center text-xs sm:justify-start">
        <UiIcon name="lucide:lock" :size="14" class="text-brand-accent shrink-0" />
        Tus datos están protegidos · Precios en soles (PEN)
      </p>
    </div>
  </section>
</template>
