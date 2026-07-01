<script setup lang="ts">
import type { PaymentGateway, PaymentGatewayProvider } from '~/types/admin-payment-gateways'

const { can } = useAdminPermissions()
const { data: gateways, isPending } = useAdminPaymentGatewaysQuery()
const updateMutation = useAdminUpdatePaymentGatewayMutation()

const editing = ref<PaymentGateway | null>(null)
const modalOpen = ref(false)
const formError = ref('')

const diagnosticsOpenFor = ref<PaymentGatewayProvider | null>(null)
const {
  data: webhookSetup,
  isFetching: isFetchingWebhookSetup,
  isError: isWebhookSetupError,
  refetch: refetchWebhookSetup,
} = useAdminMercadoPagoWebhookSetupQuery(
  computed(() => diagnosticsOpenFor.value === 'MERCADO_PAGO'),
)

function toggleDiagnostics(provider: PaymentGatewayProvider) {
  if (diagnosticsOpenFor.value === provider) {
    diagnosticsOpenFor.value = null
    return
  }
  diagnosticsOpenFor.value = provider
  void refetchWebhookSetup()
}

async function copyWebhookUrl(url: string) {
  try {
    await navigator.clipboard.writeText(url)
    useToast().success('URL de webhook copiada')
  } catch {
    useToast().error('No se pudo copiar la URL')
  }
}

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
              v-if="gateway.provider === 'MERCADO_PAGO'"
              icon="lucide:stethoscope"
              ariaLabel="Diagnóstico y webhook"
              size="sm"
              tone="admin"
              @click="toggleDiagnostics(gateway.provider)"
            />
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

        <div
          v-if="gateway.provider === 'MERCADO_PAGO' && diagnosticsOpenFor === 'MERCADO_PAGO'"
          class="border-admin-line mt-3 space-y-3 border-t pt-3 text-sm"
        >
          <div v-if="isFetchingWebhookSetup" class="text-admin-muted flex items-center gap-2">
            <UiSpinner size="sm" />
            Consultando diagnóstico…
          </div>
          <UiAlert v-else-if="isWebhookSetupError" variant="error">
            No se pudo obtener el diagnóstico de Mercado Pago.
          </UiAlert>
          <template v-else-if="webhookSetup">
            <div>
              <p class="font-medium">URL de webhook</p>
              <div class="mt-1 flex items-center gap-2">
                <code class="bg-admin-muted/10 flex-1 truncate rounded px-2 py-1 text-xs">
                  {{ webhookSetup.webhookUrl }}
                </code>
                <UiIconButton
                  icon="lucide:copy"
                  ariaLabel="Copiar URL"
                  size="sm"
                  tone="admin"
                  @click="copyWebhookUrl(webhookSetup.webhookUrl)"
                />
              </div>
              <p class="text-admin-muted mt-1 text-xs">
                Regístrala en el panel de Mercado Pago (Tu negocio → Webhooks) para los eventos:
                {{ webhookSetup.recommendedEvents.join(', ') }}.
              </p>
            </div>

            <div class="flex flex-wrap items-center gap-2">
              <UiBadge :variant="webhookSetup.secretConfigured ? 'success' : 'warning'">
                {{ webhookSetup.secretConfigured ? 'Firma de webhook configurada' : 'Sin secreto de webhook' }}
              </UiBadge>
              <UiBadge :variant="webhookSetup.credentials.healthy ? 'success' : 'danger'">
                {{ webhookSetup.credentials.healthy ? 'Credenciales OK' : 'Credenciales con problemas' }}
              </UiBadge>
              <UiBadge v-if="webhookSetup.credentials.configured && webhookSetup.credentials.isTestUserAccount" variant="warning">
                Cuenta test_user
              </UiBadge>
            </div>

            <ul v-if="webhookSetup.credentials.issues.length" class="list-disc space-y-1 pl-5 text-xs text-red-600 dark:text-red-400">
              <li v-for="issue in webhookSetup.credentials.issues" :key="issue">{{ issue }}</li>
            </ul>

            <p
              v-if="webhookSetup.credentials.configured && webhookSetup.credentials.sandboxPayerEmail"
              class="text-admin-muted text-xs"
            >
              Correo de comprador para pruebas: <code>{{ webhookSetup.credentials.sandboxPayerEmail }}</code>
            </p>
          </template>
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
