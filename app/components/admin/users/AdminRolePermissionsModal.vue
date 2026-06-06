<script setup lang="ts">
import { formatModuleLabel } from '~/constants/admin-permissions'
import type { PermissionCatalogItem, StaffRole } from '~/types/admin-users'

const open = defineModel<boolean>({ required: true })

const props = defineProps<{
  role: StaffRole | null
  permissions: PermissionCatalogItem[]
}>()

const updateMutation = useAdminUpdateRolePermissionsMutation()
const isSubmitting = computed(() => updateMutation.isPending.value)

const selectedSlugs = ref<string[]>([])
const errorMessage = ref('')

const isAdminRole = computed(() => props.role?.slug === 'admin')

const permissionsByModule = computed(() => {
  const groups = new Map<string, PermissionCatalogItem[]>()

  for (const permission of props.permissions) {
    const current = groups.get(permission.module) ?? []
    current.push(permission)
    groups.set(permission.module, current)
  }

  return [...groups.entries()]
    .map(([module, items]) => ({
      module,
      label: formatModuleLabel(module),
      permissions: items.sort((a, b) => a.name.localeCompare(b.name)),
    }))
    .sort((a, b) => a.label.localeCompare(b.label))
})

function loadRole(role: StaffRole) {
  selectedSlugs.value = role.permissions.map((permission) => permission.slug)
  errorMessage.value = ''
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
})

async function onSubmit() {
  errorMessage.value = ''
  if (!props.role || isAdminRole.value) return

  if (!selectedSlugs.value.length) {
    errorMessage.value = 'Selecciona al menos un permiso.'
    return
  }

  try {
    await updateMutation.mutateAsync({
      slug: props.role.slug,
      payload: { permissionSlugs: selectedSlugs.value },
    })
    useToast().success(`Permisos de "${props.role.name}" actualizados`)
    open.value = false
  } catch (error) {
    errorMessage.value = useApiErrorMessage(error)
  }
}
</script>

<template>
  <UiModal
    v-model="open"
    title="Gestionar permisos del rol"
    :description="role?.name"
    size="lg"
  >
    <div v-if="role" class="space-y-4">
      <UiAlert v-if="errorMessage" variant="error">{{ errorMessage }}</UiAlert>

      <UiAlert v-if="isAdminRole" variant="warning">
        El rol <strong>Administrador</strong> tiene todos los permisos del sistema
        y no se puede modificar.
      </UiAlert>

      <template v-else>
        <p class="text-admin-muted text-sm">
          Selecciona los permisos que tendrán los usuarios con el rol
          <strong class="text-admin">{{ role.name }}</strong>.
        </p>

        <div class="space-y-4">
          <div
            v-for="group in permissionsByModule"
            :key="group.module"
            class="border-admin-line rounded-xl border p-4"
          >
            <p class="text-admin mb-3 text-sm font-semibold">{{ group.label }}</p>
            <UiCheckboxGroup
              v-model="selectedSlugs"
              :options="
                group.permissions.map((permission) => ({
                  label: permission.name,
                  value: permission.slug,
                  hint: permission.slug,
                }))
              "
            />
          </div>
        </div>
      </template>
    </div>

    <template #footer>
      <UiButton variant="ghost" :disabled="isSubmitting" @click="open = false">
        Cancelar
      </UiButton>
      <UiButton
        v-if="!isAdminRole"
        :loading="isSubmitting"
        @click="onSubmit"
      >
        Guardar permisos
      </UiButton>
    </template>
  </UiModal>
</template>
