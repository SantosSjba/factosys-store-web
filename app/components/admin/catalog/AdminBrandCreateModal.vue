<script setup lang="ts">
import type { CreateBrandPayload } from '~/types/admin-catalog'
import { createBrandSchema } from '~/utils/validation/schemas'

const open = defineModel<boolean>({ required: true })
const createMutation = useAdminCreateBrandMutation()
const uploadLogoMutation = useAdminUploadBrandLogoMutation()
const logoFile = ref<File | null>(null)

const { resetForm, createSubmitHandler } = useApiForm({
  schema: createBrandSchema,
  initialValues: {
    name: '',
    slug: '',
    description: '',
    website: '',
    isActive: 'true' as const,
  },
})

const isSubmitting = computed(
  () => createMutation.isPending.value || uploadLogoMutation.isPending.value,
)

const submitLabel = computed(() => {
  if (uploadLogoMutation.isPending.value) return 'Subiendo logo…'
  if (createMutation.isPending.value) return 'Creando marca…'
  return 'Crear marca'
})

const onSubmit = createSubmitHandler(
  async (values) => {
    const payload: CreateBrandPayload = {
      name: values.name,
      slug: values.slug,
      description: values.description,
      website: values.website,
      isActive: values.isActive === 'true',
    }
    const brand = await createMutation.mutateAsync(payload)

    if (logoFile.value) {
      await uploadLogoMutation.mutateAsync({ brandId: brand.id, file: logoFile.value })
    }

    open.value = false
  },
  {
    successMessage: () =>
      logoFile.value
        ? 'Marca creada y logo subido correctamente'
        : 'Marca creada correctamente',
  },
)

watch(open, (v) => {
  if (!v) {
    resetForm()
    logoFile.value = null
  }
})
</script>

<template>
  <UiModal
    v-model="open"
    title="Nueva marca"
    description="Fabricante o línea comercial del catálogo."
    size="lg"
  >
    <form class="space-y-5" @submit.prevent="onSubmit">
      <AdminFormSection
        title="Identidad de marca"
        description="Nombre, slug y descripción pública."
        icon="lucide:award"
      >
        <div class="grid gap-4 sm:grid-cols-2">
          <UiFormField name="name" label="Nombre" class="sm:col-span-2" autocomplete="off" required />
          <UiFormField name="slug" label="Slug" hint="Opcional" autocomplete="off" />
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
          v-model:pending-file="logoFile"
          kind="brand-logo"
          :disabled="isSubmitting"
        />
      </AdminFormSection>
    </form>

    <template #footer>
      <AdminModalFooter
        :submit-label="submitLabel"
        :loading="isSubmitting"
        @cancel="open = false"
        @submit="onSubmit"
      />
    </template>
  </UiModal>
</template>
