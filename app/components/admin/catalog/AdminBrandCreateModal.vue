<script setup lang="ts">
import type { CreateBrandPayload } from '~/types/admin-catalog'
import { createBrandSchema } from '~/utils/validation/schemas'

const open = defineModel<boolean>({ required: true })
const createMutation = useAdminCreateBrandMutation()

const { resetForm, createSubmitHandler, withMutationPending } = useApiForm({
  schema: createBrandSchema,
  initialValues: {
    name: '',
    slug: '',
    description: '',
    website: '',
    isActive: 'true' as const,
  },
})

const isSubmitting = withMutationPending(createMutation)

const onSubmit = createSubmitHandler(
  async (values) => {
    const payload: CreateBrandPayload = {
      name: values.name,
      slug: values.slug,
      description: values.description,
      website: values.website,
      isActive: values.isActive === 'true',
    }
    await createMutation.mutateAsync(payload)
    open.value = false
  },
  { successMessage: 'Marca creada correctamente' },
)

watch(open, (v) => { if (!v) resetForm() })
</script>

<template>
  <UiModal v-model="open" title="Nueva marca" size="lg">
    <form class="grid gap-4 sm:grid-cols-2" @submit.prevent="onSubmit">
      <UiFormField name="name" label="Nombre" class="sm:col-span-2" autocomplete="off" required />
      <UiFormField name="slug" label="Slug" hint="Opcional" autocomplete="off" />
      <UiFormSelect
        name="isActive"
        label="Estado"
        :options="[
          { label: 'Activa', value: 'true' },
          { label: 'Inactiva', value: 'false' },
        ]"
      />
      <UiFormField name="website" label="Sitio web" class="sm:col-span-2" autocomplete="off" />
      <UiFormField name="description" label="Descripción" class="sm:col-span-2" autocomplete="off" />
    </form>
    <template #footer>
      <AdminModalFooter submit-label="Crear marca" :loading="isSubmitting" @cancel="open = false" @submit="onSubmit" />
    </template>
  </UiModal>
</template>
