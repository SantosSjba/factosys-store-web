<script setup lang="ts">
import { companyProfileSchema } from '~/utils/validation/schemas'

const { can } = useAdminPermissions()
const { data: company, isPending } = useAdminCompanyQuery()
const updateMutation = useAdminUpdateCompanyMutation()

const { setValues, createSubmitHandler } = useApiForm({
  schema: companyProfileSchema,
  initialValues: {
    legalName: '',
    tradeName: '',
    taxId: '',
    taxRegime: '',
    fiscalAddress: '',
    district: '',
    province: '',
    department: '',
    country: 'PE',
    supportEmail: '',
    supportPhone: '',
    whatsapp: '',
    website: '',
  },
})

watch(company, (value) => {
  if (!value) return
  setValues({
    legalName: value.legalName ?? '',
    tradeName: value.tradeName ?? '',
    taxId: value.taxId ?? '',
    taxRegime: value.taxRegime ?? '',
    fiscalAddress: value.fiscalAddress ?? '',
    district: value.district ?? '',
    province: value.province ?? '',
    department: value.department ?? '',
    country: value.country ?? 'PE',
    supportEmail: value.supportEmail ?? '',
    supportPhone: value.supportPhone ?? '',
    whatsapp: value.whatsapp ?? '',
    website: value.website ?? '',
  })
}, { immediate: true })

const isSubmitting = computed(() => updateMutation.isPending.value)

const onSubmit = createSubmitHandler(
  async (values) => {
    await updateMutation.mutateAsync(values)
  },
  { successMessage: 'Datos de empresa guardados' },
)
</script>

<template>
  <div>
    <div v-if="isPending && !company" class="text-admin-muted flex items-center gap-2 py-8 text-sm">
      <UiSpinner size="sm" />
      Cargando empresa…
    </div>

    <form v-else class="space-y-5" @submit.prevent="onSubmit">
      <AdminFormSection
        title="Identidad legal"
        description="Razón social, RUC y régimen tributario."
        icon="lucide:building-2"
      >
        <div class="grid gap-4 sm:grid-cols-2">
          <UiFormField name="legalName" label="Razón social" class="sm:col-span-2" autocomplete="off" />
          <UiFormField name="tradeName" label="Nombre comercial" class="sm:col-span-2" autocomplete="off" />
          <UiFormField name="taxId" label="RUC / ID fiscal" autocomplete="off" />
          <UiFormField name="taxRegime" label="Régimen tributario" autocomplete="off" />
        </div>
      </AdminFormSection>

      <AdminFormSection
        title="Ubicación fiscal"
        description="Dirección para facturación y documentos."
        icon="lucide:map-pin"
      >
        <div class="grid gap-4 sm:grid-cols-2">
          <UiFormField name="fiscalAddress" label="Dirección" class="sm:col-span-2" autocomplete="off" />
          <UiFormField name="district" label="Distrito" autocomplete="off" />
          <UiFormField name="province" label="Provincia" autocomplete="off" />
          <UiFormField name="department" label="Departamento" autocomplete="off" />
          <UiFormField name="country" label="País (ISO)" autocomplete="off" hint="Ej: PE" />
        </div>
      </AdminFormSection>

      <AdminFormSection
        title="Contacto"
        description="Canales de soporte y sitio web."
        icon="lucide:phone"
      >
        <div class="grid gap-4 sm:grid-cols-2">
          <UiFormField name="supportEmail" label="Correo de soporte" type="email" autocomplete="off" />
          <UiFormField name="supportPhone" label="Teléfono" autocomplete="off" />
          <UiFormField name="whatsapp" label="WhatsApp" autocomplete="off" />
          <UiFormField name="website" label="Sitio web" autocomplete="off" />
        </div>
      </AdminFormSection>

      <AdminFormSection
        v-if="can('settings.write')"
        title="Logo de empresa"
        description="Imagen para documentos y pie de página."
        icon="lucide:image"
      >
        <AdminSettingsAssetUpload kind="company-logo" :image-url="company?.logoUrl" />
      </AdminFormSection>

      <div v-if="can('settings.write')" class="flex justify-end">
        <UiButton type="submit" :loading="isSubmitting">Guardar empresa</UiButton>
      </div>
    </form>
  </div>
</template>
