<script setup lang="ts">
import type { StoreCustomer } from '~/types/admin-customers'

const open = defineModel<boolean>({ required: true })

const props = defineProps<{
  customer: StoreCustomer | null
}>()

const displayName = computed(() =>
  props.customer ? formatUserName(props.customer) : '',
)

const createdAtLabel = computed(() => {
  if (!props.customer?.createdAt) return '—'
  return new Date(props.customer.createdAt).toLocaleString('es-PE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
})

const verifiedAtLabel = computed(() => {
  if (!props.customer?.emailVerifiedAt) return '—'
  return new Date(props.customer.emailVerifiedAt).toLocaleString('es-PE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
})
</script>

<template>
  <UiModal
    v-model="open"
    title="Detalle del cliente"
    :description="customer?.email"
    size="lg"
  >
    <div v-if="customer" class="space-y-5">
      <div class="grid gap-3 sm:grid-cols-2">
        <div class="bg-admin-surface rounded-xl p-4">
          <p class="text-admin-muted text-xs font-medium uppercase">Nombre</p>
          <p class="text-admin mt-1 font-medium">{{ displayName }}</p>
        </div>
        <div class="bg-admin-surface rounded-xl p-4">
          <p class="text-admin-muted text-xs font-medium uppercase">Estado</p>
          <UiBadge :variant="userStatusVariant(customer.status)" class="mt-2 normal-case">
            {{ formatUserStatus(customer.status) }}
          </UiBadge>
        </div>
        <div class="bg-admin-surface rounded-xl p-4">
          <p class="text-admin-muted text-xs font-medium uppercase">Acceso</p>
          <p class="text-admin mt-1 text-sm">{{ formatAuthProvider(customer.authProvider) }}</p>
        </div>
        <div class="bg-admin-surface rounded-xl p-4">
          <p class="text-admin-muted text-xs font-medium uppercase">Teléfono</p>
          <p class="text-admin mt-1">{{ customer.phone || '—' }}</p>
        </div>
        <div class="bg-admin-surface rounded-xl p-4">
          <p class="text-admin-muted text-xs font-medium uppercase">Correo verificado</p>
          <p class="text-admin mt-1 text-sm">{{ verifiedAtLabel }}</p>
        </div>
        <div class="bg-admin-surface rounded-xl p-4">
          <p class="text-admin-muted text-xs font-medium uppercase">Registrado</p>
          <p class="text-admin mt-1 text-sm">{{ createdAtLabel }}</p>
        </div>
      </div>
    </div>

    <template #footer>
      <UiButton variant="ghost" @click="open = false">Cerrar</UiButton>
    </template>
  </UiModal>
</template>
