<script setup lang="ts">
import type { StoreCustomer } from '~/types/admin-customers'

const open = defineModel<boolean>({ required: true })

const props = defineProps<{
  customer: StoreCustomer | null
}>()

const emit = defineEmits<{
  edit: []
}>()

const { can } = useAdminPermissions()

const displayName = computed(() =>
  props.customer ? formatUserName(props.customer) : '',
)
</script>

<template>
  <UiModal
    v-model="open"
    title="Detalle del cliente"
    :description="customer?.email"
    size="lg"
  >
    <div v-if="customer" class="space-y-5">
      <AdminFormSection
        title="Perfil del cliente"
        description="Información de la cuenta en la tienda online."
        icon="lucide:user-circle"
      >
        <div class="grid gap-3 sm:grid-cols-2">
          <AdminDetailCell label="Nombre">
            <p class="font-medium">{{ displayName }}</p>
          </AdminDetailCell>
          <AdminDetailCell label="Estado">
            <UiBadge :variant="userStatusVariant(customer.status)" class="normal-case">
              {{ formatUserStatus(customer.status) }}
            </UiBadge>
          </AdminDetailCell>
          <AdminDetailCell label="Acceso">
            <span class="text-sm">{{ formatAuthProvider(customer.authProvider) }}</span>
          </AdminDetailCell>
          <AdminDetailCell label="Teléfono">
            {{ customer.phone || '—' }}
          </AdminDetailCell>
        </div>
      </AdminFormSection>

      <AdminFormSection
        title="Verificación y registro"
        description="Historial de activación de la cuenta."
        icon="lucide:mail-check"
      >
        <div class="grid gap-3 sm:grid-cols-2">
          <AdminDetailCell label="Correo verificado">
            <span class="text-sm">{{ formatAdminDateTime(customer.emailVerifiedAt) }}</span>
          </AdminDetailCell>
          <AdminDetailCell label="Registrado">
            <span class="text-sm">{{ formatAdminDateTime(customer.createdAt) }}</span>
          </AdminDetailCell>
        </div>
      </AdminFormSection>
    </div>

    <template #footer>
      <UiButton variant="ghost" @click="open = false">Cerrar</UiButton>
      <UiButton v-if="can('users.update')" @click="emit('edit')">
        <UiIcon name="lucide:pencil" :size="16" class="mr-2" />
        Editar cliente
      </UiButton>
    </template>
  </UiModal>
</template>
