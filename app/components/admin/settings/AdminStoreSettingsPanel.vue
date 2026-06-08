<script setup lang="ts">
import { storeSettingsSchema } from '~/utils/validation/schemas'

const { can } = useAdminPermissions()
const { data: settings, isPending } = useAdminStoreSettingsQuery()
const { data: currencies } = useAdminActiveCurrenciesQuery()
const { data: taxes } = useAdminActiveTaxRatesQuery()
const { data: warehouses } = useAdminActiveWarehousesQuery()
const updateMutation = useAdminUpdateStoreSettingsMutation()

const boolOptions = [
  { label: 'Sí', value: 'true' },
  { label: 'No', value: 'false' },
]

const currencyOptions = computed(() =>
  (currencies.value ?? []).map((item) => ({ label: `${item.code} — ${item.name}`, value: item.code })),
)

const taxOptions = computed(() => [
  { label: 'Sin impuesto predeterminado', value: '' },
  ...(taxes.value ?? []).map((item) => ({
    label: `${item.name} (${item.rate}%)`,
    value: item.id,
  })),
])

const warehouseOptions = computed(() => [
  { label: 'Sin almacén predeterminado', value: '' },
  ...(warehouses.value ?? []).map((item) => ({ label: item.name, value: item.id })),
])

const { setValues, createSubmitHandler } = useApiForm({
  schema: storeSettingsSchema,
  initialValues: {
    storeName: '',
    storeTagline: '',
    defaultLocale: 'es-PE',
    timezone: 'America/Lima',
    defaultCurrencyCode: 'PEN',
    defaultTaxRateId: '',
    pricesIncludeTax: 'false' as const,
    metaTitleDefault: '',
    metaDescriptionDefault: '',
    maintenanceMode: 'false' as const,
    maintenanceMessage: '',
    guestCheckoutEnabled: 'true' as const,
    minOrderAmount: '',
    orderNumberPrefix: 'FS-',
    defaultWarehouseId: '',
    lowStockGlobalThreshold: '',
    warrantyPolicyUrl: '',
    returnsPolicyUrl: '',
    privacyPolicyUrl: '',
    termsUrl: '',
    complaintsBookUrl: '',
    serialNumberRequired: 'false' as const,
    orderConfirmationEmailEnabled: 'true' as const,
    mailFromName: '',
  },
})

watch(settings, (value) => {
  if (!value) return
  setValues({
    storeName: value.storeName,
    storeTagline: value.storeTagline ?? '',
    defaultLocale: value.defaultLocale,
    timezone: value.timezone,
    defaultCurrencyCode: value.defaultCurrencyCode,
    defaultTaxRateId: value.defaultTaxRateId ?? '',
    pricesIncludeTax: value.pricesIncludeTax ? 'true' : 'false',
    metaTitleDefault: value.metaTitleDefault ?? '',
    metaDescriptionDefault: value.metaDescriptionDefault ?? '',
    maintenanceMode: value.maintenanceMode ? 'true' : 'false',
    maintenanceMessage: value.maintenanceMessage ?? '',
    guestCheckoutEnabled: value.guestCheckoutEnabled ? 'true' : 'false',
    minOrderAmount: value.minOrderAmount ?? '',
    orderNumberPrefix: value.orderNumberPrefix,
    defaultWarehouseId: value.defaultWarehouseId ?? '',
    lowStockGlobalThreshold: value.lowStockGlobalThreshold ?? '',
    warrantyPolicyUrl: value.warrantyPolicyUrl ?? '',
    returnsPolicyUrl: value.returnsPolicyUrl ?? '',
    privacyPolicyUrl: value.privacyPolicyUrl ?? '',
    termsUrl: value.termsUrl ?? '',
    complaintsBookUrl: value.complaintsBookUrl ?? '',
    serialNumberRequired: value.serialNumberRequired ? 'true' : 'false',
    orderConfirmationEmailEnabled: value.orderConfirmationEmailEnabled ? 'true' : 'false',
    mailFromName: value.mailFromName ?? '',
  })
}, { immediate: true })

const isSubmitting = computed(() => updateMutation.isPending.value)

const onSubmit = createSubmitHandler(
  async (values) => {
    await updateMutation.mutateAsync({
      storeName: values.storeName,
      storeTagline: values.storeTagline,
      defaultLocale: values.defaultLocale,
      timezone: values.timezone,
      defaultCurrencyCode: values.defaultCurrencyCode,
      defaultTaxRateId: values.defaultTaxRateId || null,
      pricesIncludeTax: values.pricesIncludeTax === 'true',
      metaTitleDefault: values.metaTitleDefault,
      metaDescriptionDefault: values.metaDescriptionDefault,
      maintenanceMode: values.maintenanceMode === 'true',
      maintenanceMessage: values.maintenanceMessage,
      guestCheckoutEnabled: values.guestCheckoutEnabled === 'true',
      minOrderAmount: values.minOrderAmount === '' ? null : Number(values.minOrderAmount),
      orderNumberPrefix: values.orderNumberPrefix,
      defaultWarehouseId: values.defaultWarehouseId || null,
      lowStockGlobalThreshold:
        values.lowStockGlobalThreshold === '' ? null : Number(values.lowStockGlobalThreshold),
      warrantyPolicyUrl: values.warrantyPolicyUrl,
      returnsPolicyUrl: values.returnsPolicyUrl,
      privacyPolicyUrl: values.privacyPolicyUrl,
      termsUrl: values.termsUrl,
      complaintsBookUrl: values.complaintsBookUrl,
      serialNumberRequired: values.serialNumberRequired === 'true',
      orderConfirmationEmailEnabled: values.orderConfirmationEmailEnabled === 'true',
      mailFromName: values.mailFromName,
    })
  },
  { successMessage: 'Configuración de tienda guardada' },
)
</script>

<template>
  <div>
    <div v-if="isPending && !settings" class="text-admin-muted flex items-center gap-2 py-8 text-sm">
      <UiSpinner size="sm" />
      Cargando configuración…
    </div>

    <form v-else class="space-y-5" @submit.prevent="onSubmit">
      <AdminFormSection title="Identidad de tienda" icon="lucide:store">
        <div class="grid gap-4 sm:grid-cols-2">
          <UiFormField name="storeName" label="Nombre" class="sm:col-span-2" required />
          <UiFormField name="storeTagline" label="Eslogan" class="sm:col-span-2" />
          <UiFormField name="defaultLocale" label="Idioma/región" hint="Ej: es-PE" />
          <UiFormField name="timezone" label="Zona horaria" hint="Ej: America/Lima" />
        </div>
        <div v-if="can('settings.write')" class="mt-4 grid gap-6 lg:grid-cols-2">
          <div>
            <p class="mb-2 text-sm font-medium">Logo de tienda</p>
            <AdminSettingsAssetUpload kind="store-logo" :image-url="settings?.logoUrl" />
          </div>
          <div>
            <p class="mb-2 text-sm font-medium">Favicon</p>
            <AdminSettingsAssetUpload kind="store-favicon" :image-url="settings?.faviconUrl" />
          </div>
        </div>
      </AdminFormSection>

      <AdminFormSection title="Moneda e impuestos" icon="lucide:circle-dollar-sign">
        <div class="grid gap-4 sm:grid-cols-2">
          <UiFormSelect name="defaultCurrencyCode" label="Moneda predeterminada" :options="currencyOptions" required />
          <UiFormSelect name="defaultTaxRateId" label="Impuesto predeterminado" :options="taxOptions" />
          <UiFormSelect name="pricesIncludeTax" label="Precios incluyen impuesto" :options="boolOptions" />
          <UiFormField name="minOrderAmount" label="Monto mínimo de pedido" type="number" min="0" step="0.01" />
        </div>
      </AdminFormSection>

      <AdminFormSection title="Operaciones" icon="lucide:settings-2">
        <div class="grid gap-4 sm:grid-cols-2">
          <UiFormField name="orderNumberPrefix" label="Prefijo de pedido" required />
          <UiFormSelect name="defaultWarehouseId" label="Almacén predeterminado" :options="warehouseOptions" />
          <UiFormField name="lowStockGlobalThreshold" label="Umbral global stock bajo" type="number" min="0" />
          <UiFormSelect name="guestCheckoutEnabled" label="Checkout invitado" :options="boolOptions" />
          <UiFormSelect name="serialNumberRequired" label="Requiere nº de serie" :options="boolOptions" />
        </div>
      </AdminFormSection>

      <AdminFormSection title="SEO" icon="lucide:search">
        <div class="grid gap-4">
          <UiFormField name="metaTitleDefault" label="Meta título por defecto" />
          <UiFormField name="metaDescriptionDefault" label="Meta descripción por defecto" />
        </div>
      </AdminFormSection>

      <AdminFormSection title="Políticas y cumplimiento" icon="lucide:file-text">
        <div class="grid gap-4 sm:grid-cols-2">
          <UiFormField name="warrantyPolicyUrl" label="URL garantías" />
          <UiFormField name="returnsPolicyUrl" label="URL devoluciones" />
          <UiFormField name="privacyPolicyUrl" label="URL privacidad" />
          <UiFormField name="termsUrl" label="URL términos" />
          <UiFormField
            name="complaintsBookUrl"
            label="URL Libro de Reclamaciones"
            class="sm:col-span-2"
            hint="Obligatorio para comercio electrónico en Perú (Indecopi). Debe ser visible en la tienda pública."
          />
        </div>
      </AdminFormSection>

      <AdminFormSection title="Mantenimiento y correo" icon="lucide:mail">
        <div class="grid gap-4 sm:grid-cols-2">
          <UiFormSelect name="maintenanceMode" label="Modo mantenimiento" :options="boolOptions" />
          <UiFormSelect name="orderConfirmationEmailEnabled" label="Email confirmación pedido" :options="boolOptions" />
          <UiFormField name="maintenanceMessage" label="Mensaje mantenimiento" class="sm:col-span-2" />
          <UiFormField name="mailFromName" label="Nombre remitente correo" />
        </div>
      </AdminFormSection>

      <div v-if="can('settings.write')" class="flex justify-end">
        <UiButton type="submit" :loading="isSubmitting">Guardar tienda</UiButton>
      </div>
    </form>
  </div>
</template>
