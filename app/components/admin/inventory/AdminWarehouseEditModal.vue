<script setup lang="ts">
import type { InventoryWarehouse, UpdateWarehousePayload } from '~/types/admin-inventory'
import { warehouseFormSchema } from '~/utils/validation/schemas'

const open = defineModel<boolean>({ required: true })
const props = defineProps<{ warehouse: InventoryWarehouse | null }>()
const updateMutation = useAdminUpdateWarehouseMutation()

const { resetForm, setValues, createSubmitHandler } = useApiForm({
  schema: warehouseFormSchema,
  initialValues: {
    name: '',
    code: '',
    description: '',
    address: '',
    isDefault: 'false' as const,
    isActive: 'true' as const,
    sortOrder: 0,
  },
})

const isSubmitting = computed(() => updateMutation.isPending.value)

watch(
  () => props.warehouse,
  (warehouse) => {
    if (!warehouse) return
    setValues({
      name: warehouse.name,
      code: warehouse.code,
      description: warehouse.description ?? '',
      address: warehouse.address ?? '',
      isDefault: warehouse.isDefault ? 'true' : 'false',
      isActive: warehouse.isActive ? 'true' : 'false',
      sortOrder: warehouse.sortOrder,
    })
  },
  { immediate: true },
)

watch(open, (value) => {
  if (!value) resetForm()
})

const onSubmit = createSubmitHandler(
  async (values) => {
    if (!props.warehouse) return
    const payload: UpdateWarehousePayload = {
      name: values.name,
      code: values.code.toUpperCase(),
      description: values.description,
      address: values.address,
      isDefault: values.isDefault === 'true',
      isActive: values.isActive === 'true',
      sortOrder: values.sortOrder,
    }
    await updateMutation.mutateAsync({ id: props.warehouse.id, payload })
    open.value = false
  },
  { successMessage: 'Almacén actualizado' },
)
</script>

<template>
  <UiModal v-model="open" title="Editar almacén" :description="warehouse?.code" size="lg">
    <form v-if="warehouse" class="space-y-5" @submit.prevent="onSubmit">
      <AdminFormSection title="Datos del almacén" description="Nombre e identificador único." icon="lucide:warehouse">
        <div class="grid gap-4 sm:grid-cols-2">
          <UiFormField name="name" label="Nombre" class="sm:col-span-2" autocomplete="off" required />
          <UiFormField name="code" label="Código" autocomplete="off" required />
          <UiFormField name="address" label="Dirección" class="sm:col-span-2" autocomplete="off" />
          <UiFormField name="description" label="Descripción" class="sm:col-span-2" autocomplete="off" />
          <UiFormField name="sortOrder" label="Orden" type="number" min="0" />
          <UiFormSelect
            name="isDefault"
            label="Predeterminado"
            :options="[
              { label: 'Sí', value: 'true' },
              { label: 'No', value: 'false' },
            ]"
          />
          <UiFormSelect
            name="isActive"
            label="Estado"
            :options="[
              { label: 'Activo', value: 'true' },
              { label: 'Inactivo', value: 'false' },
            ]"
          />
        </div>
      </AdminFormSection>
    </form>

    <template #footer>
      <AdminModalFooter submit-label="Guardar" :loading="isSubmitting" @cancel="open = false" @submit="onSubmit" />
    </template>
  </UiModal>
</template>
