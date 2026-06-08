<script setup lang="ts">
import type { SettingsTaxRate, UpdateTaxRatePayload } from '~/types/admin-settings'
import { taxRateFormSchema } from '~/utils/validation/schemas'

const open = defineModel<boolean>({ required: true })
const props = defineProps<{ taxRate: SettingsTaxRate | null }>()
const updateMutation = useAdminUpdateTaxRateMutation()

const { resetForm, setValues, createSubmitHandler } = useApiForm({
  schema: taxRateFormSchema,
  initialValues: {
    name: '',
    code: '',
    rate: 0,
    isDefault: 'false' as const,
    isActive: 'true' as const,
    appliesToShipping: 'false' as const,
    sortOrder: 0,
  },
})

watch(
  () => [open.value, props.taxRate] as const,
  ([isOpen, taxRate]) => {
    if (isOpen && taxRate) {
      setValues({
        name: taxRate.name,
        code: taxRate.code ?? '',
        rate: Number(taxRate.rate),
        isDefault: taxRate.isDefault ? 'true' : 'false',
        isActive: taxRate.isActive ? 'true' : 'false',
        appliesToShipping: taxRate.appliesToShipping ? 'true' : 'false',
        sortOrder: taxRate.sortOrder,
      })
    } else if (!isOpen) {
      resetForm()
    }
  },
)

const isSubmitting = computed(() => updateMutation.isPending.value)

const onSubmit = createSubmitHandler(
  async (values) => {
    if (!props.taxRate) return
    const payload: UpdateTaxRatePayload = {
      name: values.name,
      code: values.code,
      rate: values.rate,
      isDefault: values.isDefault === 'true',
      isActive: values.isActive === 'true',
      appliesToShipping: values.appliesToShipping === 'true',
      sortOrder: values.sortOrder,
    }
    await updateMutation.mutateAsync({ id: props.taxRate.id, payload })
    open.value = false
  },
  { successMessage: 'Impuesto actualizado' },
)
</script>

<template>
  <UiModal v-model="open" title="Editar impuesto" size="lg">
    <form class="space-y-4" @submit.prevent="onSubmit">
      <div class="grid gap-4 sm:grid-cols-2">
        <UiFormField name="name" label="Nombre" class="sm:col-span-2" required />
        <UiFormField name="code" label="Código fiscal" />
        <UiFormField name="rate" label="Tasa (%)" type="number" step="0.01" required />
        <UiFormField name="sortOrder" label="Orden" type="number" min="0" />
        <UiFormSelect name="isDefault" label="Predeterminado" :options="[{ label: 'Sí', value: 'true' }, { label: 'No', value: 'false' }]" />
        <UiFormSelect name="isActive" label="Estado" :options="[{ label: 'Activo', value: 'true' }, { label: 'Inactivo', value: 'false' }]" />
        <UiFormSelect name="appliesToShipping" label="Aplica a envío" :options="[{ label: 'Sí', value: 'true' }, { label: 'No', value: 'false' }]" />
      </div>
    </form>
    <template #footer>
      <AdminModalFooter submit-label="Guardar" :loading="isSubmitting" @cancel="open = false" @submit="onSubmit" />
    </template>
  </UiModal>
</template>
