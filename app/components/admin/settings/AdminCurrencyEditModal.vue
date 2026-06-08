<script setup lang="ts">
import type { SettingsCurrency, UpdateCurrencyPayload } from '~/types/admin-settings'
import { currencyFormSchema } from '~/utils/validation/schemas'

const open = defineModel<boolean>({ required: true })
const props = defineProps<{ currency: SettingsCurrency | null }>()
const updateMutation = useAdminUpdateCurrencyMutation()

const { resetForm, setValues, createSubmitHandler } = useApiForm({
  schema: currencyFormSchema,
  initialValues: {
    code: '',
    name: '',
    symbol: '',
    exchangeRate: 1,
    decimalPlaces: 2,
    isDefault: 'false' as const,
    isActive: 'true' as const,
    sortOrder: 0,
  },
})

watch(
  () => [open.value, props.currency] as const,
  ([isOpen, currency]) => {
    if (isOpen && currency) {
      setValues({
        code: currency.code,
        name: currency.name,
        symbol: currency.symbol,
        exchangeRate: Number(currency.exchangeRate),
        decimalPlaces: currency.decimalPlaces,
        isDefault: currency.isDefault ? 'true' : 'false',
        isActive: currency.isActive ? 'true' : 'false',
        sortOrder: currency.sortOrder,
      })
    } else if (!isOpen) {
      resetForm()
    }
  },
)

const isSubmitting = computed(() => updateMutation.isPending.value)

const onSubmit = createSubmitHandler(
  async (values) => {
    if (!props.currency) return
    const payload: UpdateCurrencyPayload = {
      code: values.code.toUpperCase(),
      name: values.name,
      symbol: values.symbol,
      exchangeRate: values.exchangeRate,
      decimalPlaces: values.decimalPlaces,
      isDefault: values.isDefault === 'true',
      isActive: values.isActive === 'true',
      sortOrder: values.sortOrder,
    }
    await updateMutation.mutateAsync({ id: props.currency.id, payload })
    open.value = false
  },
  { successMessage: 'Moneda actualizada' },
)
</script>

<template>
  <UiModal v-model="open" title="Editar moneda" size="lg">
    <form class="space-y-4" @submit.prevent="onSubmit">
      <div class="grid gap-4 sm:grid-cols-2">
        <UiFormField name="code" label="Código ISO" required />
        <UiFormField name="symbol" label="Símbolo" required />
        <UiFormField name="name" label="Nombre" class="sm:col-span-2" required />
        <UiFormField name="exchangeRate" label="Tipo de cambio" type="number" step="0.000001" required />
        <UiFormField name="decimalPlaces" label="Decimales" type="number" min="0" max="4" />
        <UiFormField name="sortOrder" label="Orden" type="number" min="0" />
        <UiFormSelect name="isDefault" label="Predeterminada" :options="[{ label: 'Sí', value: 'true' }, { label: 'No', value: 'false' }]" />
        <UiFormSelect name="isActive" label="Estado" :options="[{ label: 'Activa', value: 'true' }, { label: 'Inactiva', value: 'false' }]" />
      </div>
    </form>
    <template #footer>
      <AdminModalFooter submit-label="Guardar" :loading="isSubmitting" @cancel="open = false" @submit="onSubmit" />
    </template>
  </UiModal>
</template>
