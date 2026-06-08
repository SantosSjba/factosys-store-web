<script setup lang="ts">
import type { CreateWarehousePayload } from '~/types/admin-inventory'
import { warehouseFormSchema } from '~/utils/validation/schemas'

const open = defineModel<boolean>({ required: true })
const createMutation = useAdminCreateWarehouseMutation()

const { resetForm, createSubmitHandler } = useApiForm({
  schema: warehouseFormSchema,
  initialValues: {
    name: '',
    code: '',
    description: '',
    address: '',
    isDefault: 'true' as const,
    isActive: 'true' as const,
    sortOrder: 0,
  },
})

const isSubmitting = computed(() => createMutation.isPending.value)

const onSubmit = createSubmitHandler(
  async (values) => {
    const payload: CreateWarehousePayload = {
      name: values.name,
      code: values.code.toUpperCase(),
      description: values.description,
      address: values.address,
      isDefault: values.isDefault === 'true',
      isActive: values.isActive === 'true',
      sortOrder: values.sortOrder,
    }
    await createMutation.mutateAsync(payload)
    open.value = false
  },
  { successMessage: 'Almacén creado correctamente' },
)

watch(open, (value) => {
  if (!value) resetForm()
})
</script>

<template>
  <UiModal v-model="open" title="Nuevo almacén" description="Bodega o punto de almacenamiento." size="lg">
    <form class="space-y-5" @submit.prevent="onSubmit">
      <AdminFormSection title="Datos del almacén" description="Nombre e identificador único." icon="lucide:warehouse">
        <div class="grid gap-4 sm:grid-cols-2">
          <UiFormField name="name" label="Nombre" class="sm:col-span-2" autocomplete="off" required />
          <UiFormField name="code" label="Código" hint="Ej: MAIN, BOD-01" autocomplete="off" required />
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
      <AdminModalFooter submit-label="Crear almacén" :loading="isSubmitting" @cancel="open = false" @submit="onSubmit" />
    </template>
  </UiModal>
</template>
