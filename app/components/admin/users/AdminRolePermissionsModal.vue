<script setup lang="ts">
import { useField } from 'vee-validate'
import type { PermissionCatalogItem, StaffRole } from '~/types/admin-users'
import { rolePermissionsSchema } from '~/utils/validation/schemas'

const open = defineModel<boolean>({ required: true })

const props = defineProps<{
  role: StaffRole | null
  permissions: PermissionCatalogItem[]
}>()

const updateMutation = useAdminUpdateRolePermissionsMutation()

const { setValues, resetForm, createSubmitHandler, meta } = useApiForm({
  schema: rolePermissionsSchema,
  initialValues: {
    permissionSlugs: [] as string[],
  },
})

const { value: permissionSlugs, errorMessage, handleChange } =
  useField<string[]>('permissionSlugs')

const isSubmitting = computed(
  () => updateMutation.isPending.value || meta.value.pending,
)

const isAdminRole = computed(() => props.role?.slug === 'admin')

const permissionsByModule = computed(() =>
  groupCatalogPermissionsByModule(props.permissions),
)

function loadRole(role: StaffRole) {
  setValues({
    permissionSlugs: role.permissions.map((permission) => permission.slug),
  })
}

watch(
  () => props.role,
  (role) => {
    if (role) loadRole(role)
  },
  { immediate: true },
)

watch(open, (value) => {
  if (value && props.role) loadRole(props.role)
  if (!value) resetForm()
})

const onSubmit = createSubmitHandler(
  async (values) => {
    if (!props.role || isAdminRole.value) return

    await updateMutation.mutateAsync({
      slug: props.role.slug,
      payload: { permissionSlugs: values.permissionSlugs },
    })
    open.value = false
  },
  {
    successMessage: () =>
      props.role
        ? `Permisos de "${props.role.name}" actualizados`
        : 'Permisos actualizados',
  },
)
</script>

<template>
  <UiModal
    v-model="open"
    title="Gestionar permisos del rol"
    :description="role?.name"
    size="lg"
  >
    <div v-if="role" class="space-y-4">
      <UiAlert v-if="isAdminRole" variant="warning">
        El rol <strong>Administrador</strong> tiene todos los permisos del sistema
        y no se puede modificar.
      </UiAlert>

      <form v-else class="space-y-4" @submit.prevent="onSubmit">
        <p class="text-admin-muted text-sm">
          Selecciona los permisos que tendrán los usuarios con el rol
          <strong class="text-admin">{{ role.name }}</strong>.
        </p>

        <UiFieldMessage :error="errorMessage" />

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
      </form>
    </div>

    <template #footer>
      <AdminModalFooter
        submit-label="Guardar permisos"
        :loading="isSubmitting"
        :show-submit="!isAdminRole"
        @cancel="open = false"
        @submit="onSubmit"
      />
    </template>
  </UiModal>
</template>
