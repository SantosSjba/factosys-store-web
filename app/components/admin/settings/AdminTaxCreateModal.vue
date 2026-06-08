<script setup lang="ts">
import type { CreateTaxRatePayload } from '~/types/admin-settings'
import { taxRateFormSchema } from '~/utils/validation/schemas'

const open = defineModel<boolean>({ required: true })
const createMutation = useAdminCreateTaxRateMutation()

const { resetForm, createSubmitHandler } = useApiForm({
  schema: taxRateFormSchema,
  initialValues: {
    name: '',
    code: '',
    rate: 18,
    isDefault: 'false' as const,
    isActive: 'true' as const,
    appliesToShipping: 'false' as const,
    sortOrder: 0,
  },
})

const isSubmitting = computed(() => createMutation.isPending.value)

const onSubmit = createSubmitHandler(
  async (values) => {
    const payload: CreateTaxRatePayload = {
      name: values.name,
      code: values.code,
      rate: values.rate,
      isDefault: values.isDefault === 'true',
      isActive: values.isActive === 'true',
      appliesToShipping: values.appliesToShipping === 'true',
      sortOrder: values.sortOrder,
    }
    await createMutation.mutateAsync(payload)
    open.value = false
  },
  { successMessage: 'Impuesto creado' },
)

watch(open, (value) => {
  if (!value) resetForm()
})
</script>

<template>
  <UiModal v-model="open" title="Nuevo impuesto" size="lg">
    <form class="space-y-4" @submit.prevent="onSubmit">
      <div class="grid gap-4 sm:grid-cols-2">
        <UiFormField name="name" label="Nombre" class="sm:col-span-2" required />
        <UiFormField name="code" label="Código fiscal" hint="Opcional. Ej: 1000 SUNAT" />
        <UiFormField name="rate" label="Tasa (%)" type="number" step="0.01" required />
        <UiFormField name="sortOrder" label="Orden" type="number" min="0" />
        <UiFormSelect name="isDefault" label="Predeterminado" :options="[{ label: 'Sí', value: 'true' }, { label: 'No', value: 'false' }]" />
        <UiFormSelect name="isActive" label="Estado" :options="[{ label: 'Activo', value: 'true' }, { label: 'Inactivo', value: 'false' }]" />
        <UiFormSelect name="appliesToShipping" label="Aplica a envío" :options="[{ label: 'Sí', value: 'true' }, { label: 'No', value: 'false' }]" />
      </div>
    </form>
    <template #footer>
      <AdminModalFooter submit-label="Crear" :loading="isSubmitting" @cancel="open = false" @submit="onSubmit" />
    </template>
  </UiModal>
</template>
