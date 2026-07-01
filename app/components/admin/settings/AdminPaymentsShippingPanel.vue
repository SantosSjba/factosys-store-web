<script setup lang="ts">
import { paymentsShippingSchema } from '~/utils/validation/schemas'

const { can } = useAdminPermissions()
const { data: settings, isPending } = useAdminStoreSettingsQuery()
const updateMutation = useAdminUpdateStoreSettingsMutation()

const boolOptions = [
  { label: 'Sí', value: 'true' },
  { label: 'No', value: 'false' },
]

const { setValues, createSubmitHandler } = useApiForm({
  schema: paymentsShippingSchema,
  initialValues: {
    flatShippingFee: '',
    freeShippingMinAmount: '',
    handlingDaysMin: '',
    handlingDaysMax: '',
    pickupPointName: '',
    pickupPointAddress: '',
    pickupPointDistrict: '',
    pickupPointProvince: '',
    pickupPointDepartment: '',
    pickupPointHours: '',
    pickupPointPhone: '',
    paymentCashEnabled: 'true' as const,
    paymentBankTransferEnabled: 'true' as const,
    paymentYapeEnabled: 'false' as const,
    paymentPlinEnabled: 'false' as const,
    bankTransferInstructions: '',
    yapeNumber: '',
    plinNumber: '',
    abandonedGatewayOrderExpiryHours: '',
  },
})

watch(settings, (value) => {
  if (!value) return
  setValues({
    flatShippingFee: value.flatShippingFee ?? '',
    freeShippingMinAmount: value.freeShippingMinAmount ?? '',
    handlingDaysMin: value.handlingDaysMin ?? '',
    handlingDaysMax: value.handlingDaysMax ?? '',
    pickupPointName: value.pickupPointName ?? '',
    pickupPointAddress: value.pickupPointAddress ?? '',
    pickupPointDistrict: value.pickupPointDistrict ?? '',
    pickupPointProvince: value.pickupPointProvince ?? '',
    pickupPointDepartment: value.pickupPointDepartment ?? '',
    pickupPointHours: value.pickupPointHours ?? '',
    pickupPointPhone: value.pickupPointPhone ?? '',
    paymentCashEnabled: value.paymentCashEnabled ? 'true' : 'false',
    paymentBankTransferEnabled: value.paymentBankTransferEnabled ? 'true' : 'false',
    paymentYapeEnabled: value.paymentYapeEnabled ? 'true' : 'false',
    paymentPlinEnabled: value.paymentPlinEnabled ? 'true' : 'false',
    bankTransferInstructions: value.bankTransferInstructions ?? '',
    yapeNumber: value.yapeNumber ?? '',
    plinNumber: value.plinNumber ?? '',
    abandonedGatewayOrderExpiryHours: value.abandonedGatewayOrderExpiryHours ?? '',
  })
}, { immediate: true })

const isSubmitting = computed(() => updateMutation.isPending.value)

const onSubmit = createSubmitHandler(
  async (values) => {
    await updateMutation.mutateAsync({
      flatShippingFee: values.flatShippingFee === '' ? null : Number(values.flatShippingFee),
      freeShippingMinAmount:
        values.freeShippingMinAmount === '' ? null : Number(values.freeShippingMinAmount),
      handlingDaysMin: values.handlingDaysMin === '' ? null : Number(values.handlingDaysMin),
      handlingDaysMax: values.handlingDaysMax === '' ? null : Number(values.handlingDaysMax),
      pickupPointName: values.pickupPointName || null,
      pickupPointAddress: values.pickupPointAddress || null,
      pickupPointDistrict: values.pickupPointDistrict || null,
      pickupPointProvince: values.pickupPointProvince || null,
      pickupPointDepartment: values.pickupPointDepartment || null,
      pickupPointHours: values.pickupPointHours || null,
      pickupPointPhone: values.pickupPointPhone || null,
      paymentCashEnabled: values.paymentCashEnabled === 'true',
      paymentBankTransferEnabled: values.paymentBankTransferEnabled === 'true',
      paymentYapeEnabled: values.paymentYapeEnabled === 'true',
      paymentPlinEnabled: values.paymentPlinEnabled === 'true',
      bankTransferInstructions: values.bankTransferInstructions || null,
      yapeNumber: values.yapeNumber || null,
      plinNumber: values.plinNumber || null,
      abandonedGatewayOrderExpiryHours:
        values.abandonedGatewayOrderExpiryHours === ''
          ? null
          : Number(values.abandonedGatewayOrderExpiryHours),
    })
  },
  { successMessage: 'Pagos y envíos guardados' },
)
</script>

<template>
  <div>
    <div v-if="isPending && !settings" class="text-admin-muted flex items-center gap-2 py-8 text-sm">
      <UiSpinner size="sm" />
      Cargando configuración…
    </div>

    <form v-else class="space-y-5" @submit.prevent="onSubmit">
      <AdminFormSection
        title="Envíos"
        description="Tarifas y tiempos de preparación para pedidos con envío."
        icon="lucide:truck"
      >
        <div class="grid gap-4 sm:grid-cols-3">
          <UiFormField name="flatShippingFee" label="Costo base de envío" type="number" min="0" step="0.01" />
          <UiFormField name="freeShippingMinAmount" label="Envío gratis desde" type="number" min="0" step="0.01" />
          <UiFormField name="handlingDaysMin" label="Días preparación (mín)" type="number" min="0" />
          <UiFormField name="handlingDaysMax" label="Días preparación (máx)" type="number" min="0" />
        </div>
      </AdminFormSection>

      <AdminFormSection
        title="Punto de recojo"
        description="Datos que verá el cliente al elegir recojo en tienda."
        icon="lucide:store"
      >
        <div class="grid gap-4 sm:grid-cols-2">
          <UiFormField name="pickupPointName" label="Nombre del local" class="sm:col-span-2" />
          <UiFormField name="pickupPointAddress" label="Dirección" class="sm:col-span-2" />
          <UiFormField name="pickupPointDistrict" label="Distrito" />
          <UiFormField name="pickupPointProvince" label="Provincia" />
          <UiFormField name="pickupPointDepartment" label="Departamento" />
          <UiFormField name="pickupPointPhone" label="Teléfono" />
          <UiFormField
            name="pickupPointHours"
            label="Horario de atención"
            class="sm:col-span-2"
            hint="Ej: Lun–Vie 9:00–18:00"
          />
        </div>
      </AdminFormSection>

      <AdminFormSection
        title="Métodos de pago"
        description="Opciones disponibles en admin y tienda pública."
        icon="lucide:credit-card"
      >
        <div class="grid gap-4 sm:grid-cols-2">
          <UiFormSelect name="paymentCashEnabled" label="Efectivo" :options="boolOptions" />
          <UiFormSelect name="paymentBankTransferEnabled" label="Transferencia bancaria" :options="boolOptions" />
          <UiFormSelect name="paymentYapeEnabled" label="Yape" :options="boolOptions" />
          <UiFormSelect name="paymentPlinEnabled" label="Plin" :options="boolOptions" />
          <UiFormField
            name="bankTransferInstructions"
            label="Instrucciones de transferencia"
            class="sm:col-span-2"
          />
          <UiFormField name="yapeNumber" label="Número Yape" />
          <UiFormField name="plinNumber" label="Número Plin" />
        </div>
      </AdminFormSection>

      <AdminFormSection
        title="Pasarela de pago (Mercado Pago)"
        description="Reglas para pedidos que esperan pago en línea (tarjeta/Yape vía Mercado Pago)."
        icon="lucide:credit-card"
      >
        <div class="grid gap-4 sm:grid-cols-2">
          <UiFormField
            name="abandonedGatewayOrderExpiryHours"
            label="Cancelar pedido sin pagar después de (horas)"
            type="number"
            min="0"
            max="720"
            hint="0 o vacío desactiva la cancelación automática. Ej: 48 = 2 días."
          />
        </div>
        <p class="text-admin-muted mt-2 text-xs">
          Configura credenciales y modo de prueba de Mercado Pago en
          <NuxtLink to="/intranet/configuracion" class="underline">Pasarelas de pago</NuxtLink>.
        </p>
      </AdminFormSection>

      <div v-if="can('settings.write')" class="flex justify-end">
        <UiButton type="submit" :loading="isSubmitting">Guardar pagos y envíos</UiButton>
      </div>
    </form>
  </div>
</template>
