<script setup lang="ts">
definePageMeta({
  middleware: 'store-access',
})

const route = useRoute()
const orderNumber = computed(() => String(route.query.order ?? ''))

useStoreSeo({
  title: 'Pedido confirmado',
  noindex: true,
})
</script>

<template>
  <section class="mx-auto max-w-2xl px-4 py-16 text-center sm:py-20">
    <div
      class="border-theme bg-theme-surface mx-auto max-w-lg rounded-2xl border p-8 shadow-sm"
    >
      <div
        class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full"
        style="background: color-mix(in srgb, var(--brand-cyan) 15%, transparent)"
      >
        <UiIcon name="lucide:check-circle" :size="32" class="text-[var(--brand-cyan)]" />
      </div>

      <h1 class="text-theme text-2xl font-bold">¡Gracias por tu compra!</h1>
      <p class="text-theme-muted mt-3 text-sm leading-relaxed">
        Recibimos tu pedido
        <span v-if="orderNumber" class="text-theme font-semibold">{{ orderNumber }}</span>.
        Te enviamos un correo con los detalles y los pasos para completar el pago.
      </p>

      <div class="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <NuxtLink to="/productos">
          <UiButton icon="lucide:store">Seguir comprando</UiButton>
        </NuxtLink>
        <NuxtLink to="/login">
          <UiButton variant="secondary" icon="lucide:log-in">
            Crear cuenta / Iniciar sesión
          </UiButton>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
