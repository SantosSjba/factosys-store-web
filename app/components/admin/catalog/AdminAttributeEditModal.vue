<script setup lang="ts">
import { useField } from 'vee-validate'
import type { CatalogAttribute, UpdateAttributePayload } from '~/types/admin-catalog'
import { createAttributeSchema } from '~/utils/validation/schemas'

const open = defineModel<boolean>({ required: true })
const props = defineProps<{ attribute: CatalogAttribute | null }>()
const updateMutation = useAdminUpdateAttributeMutation()

const { resetForm, setValues, createSubmitHandler, withMutationPending } = useApiForm({
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
const isSubmitting = withMutationPending(updateMutation)

const dataTypeOptions = [
  { label: 'Texto', value: 'TEXT' },
  { label: 'Número', value: 'NUMBER' },
  { label: 'Sí/No', value: 'BOOLEAN' },
  { label: 'Selección', value: 'SELECT' },
  { label: 'Multi-selección', value: 'MULTI_SELECT' },
]

const scopeOptions = [
  { label: 'Producto', value: 'PRODUCT' },
  { label: 'Variante', value: 'VARIANT' },
]

watch(() => props.attribute, (a) => {
  if (!a) return
  setValues({
    name: a.name,
    slug: a.slug,
    description: a.description ?? '',
    dataType: a.dataType,
    unit: a.unit ?? '',
    scope: a.scope,
    optionsText: a.options.join(', '),
    isFilterable: a.isFilterable,
    isRequired: a.isRequired,
    sortOrder: a.sortOrder,
  })
}, { immediate: true })

watch(open, (v) => { if (!v) resetForm() })

const onSubmit = createSubmitHandler(
  async (values) => {
    if (!props.attribute) return
    const options = values.optionsText
      ? values.optionsText.split(',').map((o) => o.trim()).filter(Boolean)
      : []

    const payload: UpdateAttributePayload = {
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
    await updateMutation.mutateAsync({ id: props.attribute.id, payload })
    open.value = false
  },
  { successMessage: 'Atributo actualizado' },
)
</script>

<template>
  <UiModal v-model="open" title="Editar atributo" :description="attribute?.slug" size="lg">
    <form v-if="attribute" class="grid gap-4 sm:grid-cols-2" @submit.prevent="onSubmit">
      <UiFormField name="name" label="Nombre" class="sm:col-span-2" autocomplete="off" />
      <UiFormField name="slug" label="Slug" autocomplete="off" />
      <UiFormField name="unit" label="Unidad" autocomplete="off" />
      <UiFormSelect name="dataType" label="Tipo" :options="dataTypeOptions" />
      <UiFormSelect name="scope" label="Ámbito" :options="scopeOptions" />
      <UiFormField name="sortOrder" label="Orden" type="number" min="0" />
      <UiFormField name="optionsText" label="Opciones" class="sm:col-span-2" autocomplete="off" />
      <UiFormField name="description" label="Descripción" class="sm:col-span-2" autocomplete="off" />
      <UiCheckbox :model-value="isFilterable ?? false" label="Filtro en tienda" @update:model-value="isFilterable = $event" />
      <UiCheckbox :model-value="isRequired ?? false" label="Obligatorio" @update:model-value="isRequired = $event" />
    </form>
    <template #footer>
      <AdminModalFooter submit-label="Guardar" :loading="isSubmitting" @cancel="open = false" @submit="onSubmit" />
    </template>
  </UiModal>
</template>
