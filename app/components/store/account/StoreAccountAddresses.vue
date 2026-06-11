<script setup lang="ts">
const {
  data: addresses,
  isPending,
  isError,
  error,
  refetch,
} = useStoreAddressesQuery()

useQueryErrorToast(isError, error)
</script>

<template>
  <section class="space-y-4">
    <div>
      <h3 class="text-theme text-base font-bold sm:text-lg">Mis direcciones</h3>
      <p class="text-theme-muted mt-1 text-sm">
        Direcciones que has usado en pedidos anteriores.
      </p>
    </div>

    <div v-if="isPending" class="space-y-3">
      <UiSkeleton
        v-for="index in 2"
        :key="index"
        tone="store"
        height="88px"
        class="rounded-xl"
      />
    </div>

    <UiErrorState
      v-else-if="isError"
      title="No pudimos cargar tus direcciones"
      @retry="refetch()"
    />

    <UiEmptyState
      v-else-if="!addresses?.length"
      icon="lucide:map-pin"
      title="Sin direcciones guardadas"
      description="Cuando compres con envío a domicilio, tus direcciones aparecerán aquí."
      class="py-8"
    />

    <div v-else class="grid gap-3 sm:grid-cols-2">
      <article
        v-for="address in addresses"
        :key="address.id"
        class="border-theme bg-theme-muted/40 rounded-xl border p-4"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <p class="text-theme text-sm font-semibold">
              {{ formatCustomerAddressLabel(address) }}
            </p>
            <p class="text-theme-muted mt-1 text-sm leading-relaxed">
              {{ formatCustomerAddress(address) }}
            </p>
          </div>
          <UiBadge variant="default" class="shrink-0 normal-case">
            {{ address.type === 'SHIPPING' ? 'Envío' : 'Facturación' }}
          </UiBadge>
        </div>
        <p class="text-theme-muted mt-3 text-xs">
          Último uso: pedido {{ address.lastOrderNumber }} ·
          {{ formatStoreDate(address.lastUsedAt) }}
        </p>
      </article>
    </div>
  </section>
</template>
