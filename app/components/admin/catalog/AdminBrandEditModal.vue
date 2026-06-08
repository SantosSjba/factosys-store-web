<script setup lang="ts">
import type { CatalogBrand, UpdateBrandPayload } from '~/types/admin-catalog'
import { createBrandSchema } from '~/utils/validation/schemas'

const open = defineModel<boolean>({ required: true })
const props = defineProps<{ brand: CatalogBrand | null }>()
const updateMutation = useAdminUpdateBrandMutation()

const { resetForm, setValues, createSubmitHandler, withMutationPending } = useApiForm({
  schema: createBrandSchema,
  initialValues: {
    name: '',
    slug: '',
    description: '',
    website: '',
    isActive: 'true' as const,
  },
})

const isSubmitting = withMutationPending(updateMutation)

watch(() => props.brand, (b) => {
  if (!b) return
  setValues({
    name: b.name,
    slug: b.slug,
    description: b.description ?? '',
    website: b.website ?? '',
    isActive: b.isActive ? 'true' : 'false',
  })
}, { immediate: true })

watch(open, (v) => { if (!v) resetForm() })

const onSubmit = createSubmitHandler(
  async (values) => {
    if (!props.brand) return
    const payload: UpdateBrandPayload = {
      name: values.name,
      slug: values.slug,
      description: values.description,
      website: values.website,
      isActive: values.isActive === 'true',
    }
    await updateMutation.mutateAsync({ id: props.brand.id, payload })
    open.value = false
  },
  { successMessage: 'Marca actualizada' },
)
</script>

<template>
  <UiModal v-model="open" title="Editar marca" :description="brand?.slug" size="lg">
    <form v-if="brand" class="space-y-5" @submit.prevent="onSubmit">
      <AdminFormSection
        title="Identidad de marca"
        description="Nombre, slug y descripción pública."
        icon="lucide:award"
      >
        <div class="grid gap-4 sm:grid-cols-2">
          <UiFormField name="name" label="Nombre" class="sm:col-span-2" autocomplete="off" required />
          <UiFormField name="slug" label="Slug" autocomplete="off" />
          <UiFormField name="description" label="Descripción" class="sm:col-span-2" autocomplete="off" />
        </div>
      </AdminFormSection>

      <AdminFormSection
        title="Presencia y estado"
        description="Sitio web oficial y visibilidad en catálogo."
        icon="lucide:globe"
      >
        <div class="grid gap-4 sm:grid-cols-2">
          <UiFormField name="website" label="Sitio web" class="sm:col-span-2" autocomplete="off" />
          <UiFormSelect
            name="isActive"
            label="Estado"
            :options="[
              { label: 'Activa', value: 'true' },
              { label: 'Inactiva', value: 'false' },
            ]"
          />
        </div>
      </AdminFormSection>

      <AdminFormSection
        title="Logo de marca"
        description="Identificador visual en catálogo y fichas de producto."
        icon="lucide:image"
      >
        <AdminCatalogAssetUpload
          :entity-id="brand.id"
          kind="brand-logo"
          :image-url="brand.logoUrl"
          :disabled="isSubmitting"
        />
      </AdminFormSection>
    </form>

    <template #footer>
      <AdminModalFooter submit-label="Guardar" :loading="isSubmitting" @cancel="open = false" @submit="onSubmit" />
    </template>
  </UiModal>
</template>
