<script setup lang="ts">
import { z } from 'zod'
import type { InventoryStockLevel } from '~/types/admin-inventory'

const props = defineProps<{
  stockLevel: InventoryStockLevel | null
}>()

const open = defineModel<boolean>({ required: true })
const updateMutation = useAdminUpdateStockThresholdMutation()

const thresholdSchema = z.object({
  lowStockThreshold: z.coerce.number().min(0, 'El umbral debe ser 0 o mayor.'),
})

const { resetForm, setValues, createSubmitHandler } = useApiForm({
  schema: thresholdSchema,
  initialValues: { lowStockThreshold: 0 },
})

const isSubmitting = computed(() => updateMutation.isPending.value)

watch(
  () => [open.value, props.stockLevel] as const,
  ([isOpen, stockLevel]) => {
    if (isOpen && stockLevel) {
      setValues({ lowStockThreshold: stockLevel.lowStockThreshold ?? 0 })
    } else if (!isOpen) {
      resetForm()
    }
  },
)

const onSubmit = createSubmitHandler(
  async (values) => {
    if (!props.stockLevel) return
    await updateMutation.mutateAsync({
      stockLevelId: props.stockLevel.id,
      lowStockThreshold: values.lowStockThreshold,
    })
    open.value = false
  },
  { successMessage: 'Umbral de stock bajo actualizado' },
)
</script>

<template>
  <UiModal
    v-model="open"
    title="Umbral de stock bajo"
    :description="
      stockLevel
        ? `${stockLevel.sku} · ${stockLevel.warehouseName}`
        : 'Alerta cuando el disponible sea menor o igual al umbral.'
    "
    size="sm"
  >
    <form class="space-y-4" @submit.prevent="onSubmit">
      <UiFormField
        name="lowStockThreshold"
        label="Cantidad mínima"
        type="number"
        min="0"
        step="1"
        required
        hint="Se marca como stock bajo cuando disponible ≤ este valor."
      />
    </form>

    <template #footer>
      <AdminModalFooter
        submit-label="Guardar"
        :loading="isSubmitting"
        @cancel="open = false"
        @submit="onSubmit"
      />
    </template>
  </UiModal>
</template>
