<script setup lang="ts">
import { useField } from 'vee-validate'
import type { CreateAttributePayload } from '~/types/admin-catalog'
import { createAttributeSchema } from '~/utils/validation/schemas'

const open = defineModel<boolean>({ required: true })
const createMutation = useAdminCreateAttributeMutation()

const { resetForm, createSubmitHandler, withMutationPending } = useApiForm({
  schema: createAttributeSchema,
  initialValues: {
    name: '',
    slug: '',
    description: '',
    dataType: 'TEXT' as const,
    unit: '',
    scope: 'PRODUCT' as const,
    optionsText: '',
    isFilterable: false,
    isRequired: false,
    sortOrder: 0,
  },
})

const { value: isFilterable } = useField<boolean>('isFilterable')
const { value: isRequired } = useField<boolean>('isRequired')
const isSubmitting = withMutationPending(createMutation)

const dataTypeOptions = [
  { label: 'Texto', value: 'TEXT' },
  { label: 'Número', value: 'NUMBER' },
  { label: 'Sí/No', value: 'BOOLEAN' },
  { label: 'Selección', value: 'SELECT' },
  { label: 'Multi-selección', value: 'MULTI_SELECT' },
]

const scopeOptions = [
  { label: 'Producto (ej. RAM, material)', value: 'PRODUCT' },
  { label: 'Variante (ej. color, talla)', value: 'VARIANT' },
]

const onSubmit = createSubmitHandler(
  async (values) => {
    const options = values.optionsText
      ? values.optionsText.split(',').map((o) => o.trim()).filter(Boolean)
      : undefined

    const payload: CreateAttributePayload = {
      name: values.name,
      slug: values.slug,
      description: values.description,
      dataType: values.dataType,
      unit: values.unit,
      scope: values.scope,
      options,
      isFilterable: values.isFilterable,
      isRequired: values.isRequired,
      sortOrder: values.sortOrder,
    }
    await createMutation.mutateAsync(payload)
    open.value = false
  },
  { successMessage: 'Atributo creado' },
)

watch(open, (v) => { if (!v) resetForm() })
</script>

<template>
  <UiModal v-model="open" title="Nuevo atributo" description="Especificaciones técnicas o variantes (color/talla)." size="lg">
    <form class="grid gap-4 sm:grid-cols-2" @submit.prevent="onSubmit">
      <UiFormField name="name" label="Nombre" class="sm:col-span-2" autocomplete="off" required />
      <UiFormField name="slug" label="Slug" hint="Opcional" autocomplete="off" />
      <UiFormField name="unit" label="Unidad" hint="Ej. GB, MHz" autocomplete="off" />
      <UiFormSelect name="dataType" label="Tipo de dato" :options="dataTypeOptions" required />
      <UiFormSelect name="scope" label="Ámbito" :options="scopeOptions" required />
      <UiFormField name="sortOrder" label="Orden" type="number" min="0" />
      <UiFormField
        name="optionsText"
        label="Opciones"
        class="sm:col-span-2"
        hint="Para SELECT. Separadas por coma: Rojo, Azul, Negro"
        autocomplete="off"
      />
      <UiFormField name="description" label="Descripción" class="sm:col-span-2" autocomplete="off" />
      <UiCheckbox v-model="isFilterable" label="Usar en filtros de tienda" />
      <UiCheckbox v-model="isRequired" label="Obligatorio en productos" />
    </form>
    <template #footer>
      <AdminModalFooter submit-label="Crear atributo" :loading="isSubmitting" @cancel="open = false" @submit="onSubmit" />
    </template>
  </UiModal>
</template>
