<script setup lang="ts">
import { useField } from 'vee-validate'
import type { PermissionCatalogItem } from '~/types/admin-users'
import { roleCreateSchema } from '~/utils/validation/schemas'

const open = defineModel<boolean>({ required: true })

const props = defineProps<{
  permissions: PermissionCatalogItem[]
}>()

const createMutation = useAdminCreateRoleMutation()

const { resetForm, createSubmitHandler, withMutationPending } = useApiForm({
  schema: roleCreateSchema,
  initialValues: {
    name: '',
    slug: '',
    description: '',
    permissionSlugs: [] as string[],
  },
})

const { value: permissionSlugs, errorMessage: permissionsError, handleChange } =
  useField<string[]>('permissionSlugs')

const isSubmitting = withMutationPending(createMutation)

const permissionsByModule = computed(() =>
  groupCatalogPermissionsByModule(props.permissions),
)

watch(open, (value) => {
  if (!value) resetForm()
})

const onSubmit = createSubmitHandler(
  async (values) => {
    await createMutation.mutateAsync({
      name: values.name.trim(),
      slug: values.slug.trim(),
      description: values.description?.trim() || undefined,
      permissionSlugs: values.permissionSlugs,
    })
    open.value = false
  },
  { successMessage: 'Rol creado correctamente' },
)
</script>

<template>
  <UiModal
    v-model="open"
    title="Nuevo rol"
    description="Define nombre, slug y permisos iniciales del rol personalizado."
    size="lg"
  >
    <form class="space-y-4" @submit.prevent="onSubmit">
      <AdminFormSection title="Datos del rol" icon="lucide:shield">
        <div class="grid gap-4 sm:grid-cols-2">
          <UiFormField name="name" label="Nombre" required class="sm:col-span-2" />
          <UiFormField
            name="slug"
            label="Slug"
            hint="Solo minúsculas, números y guiones"
            required
          />
          <UiFormField name="description" label="Descripción" class="sm:col-span-2" />
        </div>
      </AdminFormSection>

      <AdminFormSection title="Permisos" icon="lucide:key-round">
        <UiFieldMessage :error="permissionsError" />
        <div class="space-y-4">
          <div
            v-for="group in permissionsByModule"
            :key="group.module"
            class="border-admin-line rounded-xl border p-4"
          >
            <p class="text-admin mb-3 text-sm font-semibold">{{ group.label }}</p>
            <UiCheckboxGroup
              :model-value="permissionSlugs ?? []"
              :options="
                group.permissions.map((permission) => ({
                  label: permission.name,
                  value: permission.slug,
                  hint: permission.slug,
                }))
              "
              @update:model-value="handleChange"
            />
          </div>
        </div>
      </AdminFormSection>
    </form>

    <template #footer>
      <AdminModalFooter
        submit-label="Crear rol"
        :loading="isSubmitting"
        @cancel="open = false"
        @submit="onSubmit"
      />
    </template>
  </UiModal>
</template>
