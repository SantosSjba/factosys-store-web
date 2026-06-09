<script setup lang="ts">
import type { PaymentGateway, PaymentGatewayProvider } from '~/types/admin-payment-gateways'

const { can } = useAdminPermissions()
const { data: gateways, isPending } = useAdminPaymentGatewaysQuery()
const updateMutation = useAdminUpdatePaymentGatewayMutation()

const editing = ref<PaymentGateway | null>(null)
const modalOpen = ref(false)
const formError = ref('')

const displayName = ref('')
const isEnabled = ref(false)
const isTestMode = ref(true)
const publicKey = ref('')
const secretKey = ref('')
const webhookSecret = ref('')

const PROVIDER_LABELS: Record<PaymentGatewayProvider, string> = {
  CULQI: 'Culqi',
  MERCADO_PAGO: 'Mercado Pago',
  STRIPE: 'Stripe',
}

function openEdit(gateway: PaymentGateway) {
  editing.value = gateway
  displayName.value = gateway.displayName
  isEnabled.value = gateway.isEnabled
  isTestMode.value = gateway.isTestMode
  publicKey.value = gateway.publicKey ?? ''
  secretKey.value = ''
  webhookSecret.value = ''
  formError.value = ''
  modalOpen.value = true
}

async function onSubmit() {
  if (!editing.value) return
  formError.value = ''
  try {
    await updateMutation.mutateAsync({
      provider: editing.value.provider,
      payload: {
        displayName: displayName.value.trim() || undefined,
        isEnabled: isEnabled.value,
        isTestMode: isTestMode.value,
        publicKey: publicKey.value.trim() || undefined,
        secretKey: secretKey.value.trim() || undefined,
        webhookSecret: webhookSecret.value.trim() || undefined,
      },
    })
    useToast().success('Pasarela actualizada')
    modalOpen.value = false
  } catch (error) {
    formError.value = useApiErrorMessage(error)
  }
}
</script>

<template>
  <div class="space-y-4">
    <p class="text-admin-muted text-sm">
      Configura las pasarelas de pago en línea disponibles en la tienda.
    </p>

    <div v-if="isPending && !gateways?.length" class="text-admin-muted flex items-center gap-2 text-sm">
      <UiSpinner size="sm" />
      Cargando pasarelas…
    </div>

    <div v-else class="grid gap-4 md:grid-cols-2">
      <AdminCard
        v-for="gateway in gateways"
        :key="gateway.provider"
        :title="PROVIDER_LABELS[gateway.provider] ?? gateway.displayName"
        icon="lucide:credit-card"
        :description="gateway.displayName"
      >
        <template #actions>
          <div class="flex items-center gap-2">
            <UiBadge :variant="gateway.isEnabled ? 'success' : 'default'">
              {{ gateway.isEnabled ? 'Activa' : 'Inactiva' }}
            </UiBadge>
            <UiBadge v-if="gateway.isTestMode" variant="warning">Prueba</UiBadge>
            <UiIconButton
              v-if="can('settings.write')"
              icon="lucide:settings-2"
              ariaLabel="Configurar"
              size="sm"
              tone="admin"
              @click="openEdit(gateway)"
            />
          </div>
        </template>
        <div class="text-admin-muted space-y-1 text-sm">
          <p v-if="gateway.publicKey">Clave pública: {{ gateway.publicKey }}</p>
          <p v-if="gateway.secretKey">Clave secreta: {{ gateway.secretKey }}</p>
          <p v-else class="text-xs">Sin clave secreta configurada</p>
        </div>
      </AdminCard>
    </div>

    <UiModal
      v-model="modalOpen"
      title="Configurar pasarela"
      :description="editing ? PROVIDER_LABELS[editing.provider] : ''"
      size="lg"
    >
      <form class="space-y-4" @submit.prevent="onSubmit">
        <UiAlert v-if="formError" variant="error">{{ formError }}</UiAlert>
        <UiInput v-model="displayName" label="Nombre visible" />
        <div class="flex flex-wrap gap-4">
          <UiCheckbox v-model="isEnabled" label="Pasarela activa" />
          <UiCheckbox v-model="isTestMode" label="Modo de prueba" />
        </div>
        <UiInput v-model="publicKey" label="Clave pública" />
        <UiInput
          v-model="secretKey"
          label="Clave secreta"
          type="password"
          hint="Deja vacío para mantener la actual"
        />
        <UiInput
          v-model="webhookSecret"
          label="Secreto de webhook"
          type="password"
          hint="Deja vacío para mantener el actual"
        />
      </form>
      <template #footer>
        <AdminModalFooter
          submit-label="Guardar"
          :loading="updateMutation.isPending.value"
          @cancel="modalOpen = false"
          @submit="onSubmit"
        />
      </template>
    </UiModal>
  </div>
</template>
