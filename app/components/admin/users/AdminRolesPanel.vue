<script setup lang="ts">
import { getModuleIcon } from '~/constants/admin-permissions'
import { getRoleIcon } from '~/constants/admin-roles'
import type { StaffRole } from '~/types/admin-users'

const { can } = useAdminPermissions()
const { data: roles, isPending, isError, error } = useAdminRolesQuery()
const { data: permissions } = useAdminPermissionsQuery()

const permissionsOpen = ref(false)
const selectedRole = ref<StaffRole | null>(null)

useQueryErrorToast(isError, error)

const permissionsByModule = computed(() => {
  const allPermissions = (roles.value ?? []).flatMap((role) => role.permissions)
  return groupCatalogPermissionsByModule(allPermissions, { dedupe: true })
})

function openPermissions(role: StaffRole) {
  selectedRole.value = role
  permissionsOpen.value = true
}
</script>

<template>
  <div class="space-y-4">
    <div v-if="isPending" class="grid gap-4 md:grid-cols-2">
      <UiSkeleton v-for="i in 4" :key="i" height="12rem" />
    </div>

    <div v-else-if="!roles?.length" class="py-8">
      <UiEmptyState
        title="Sin roles"
        description="No hay roles de staff configurados en el sistema."
      />
    </div>

    <div v-else class="grid gap-4 lg:grid-cols-2">
      <AdminCard
        v-for="role in roles"
        :key="role.id"
        :title="role.name"
        :icon="getRoleIcon(role.slug)"
        :description="role.description || `Slug: ${role.slug}`"
      >
        <template #actions>
          <div class="flex items-center gap-1">
            <UiBadge :variant="role.isSystem ? 'info' : 'default'" class="normal-case">
              {{ role.isSystem ? 'Sistema' : 'Personalizado' }}
            </UiBadge>
            <UiIconButton
              v-if="can('roles.assign') && role.slug !== 'admin'"
              icon="lucide:settings-2"
              ariaLabel="Gestionar permisos"
              title="Gestionar permisos"
              size="sm"
              tone="admin"
              @click="openPermissions(role)"
            />
          </div>
        </template>

        <p class="text-admin-muted mb-3 text-xs font-medium uppercase">
          {{ role.permissions.length }} permisos
        </p>
        <div class="flex flex-wrap gap-2">
          <UiBadge
            v-for="permission in role.permissions"
            :key="permission.slug"
            variant="primary"
            class="normal-case"
          >
            {{ permission.name }}
          </UiBadge>
        </div>
      </AdminCard>
    </div>

    <AdminCard
      v-if="permissionsByModule.length"
      title="Catálogo de permisos"
      icon="lucide:key-round"
      description="Permisos disponibles en el sistema, agrupados por módulo."
    >
      <div class="grid gap-4 md:grid-cols-2">
        <div
          v-for="group in permissionsByModule"
          :key="group.module"
          class="bg-admin-surface rounded-xl p-4"
        >
          <div class="text-admin mb-2 flex items-center gap-2 font-semibold">
            <UiIcon
              :name="getModuleIcon(group.module)"
              :size="18"
              class="shrink-0"
              style="color: var(--admin-primary)"
            />
            {{ group.label }}
          </div>
          <ul class="text-admin-muted space-y-1 text-sm">
            <li v-for="permission in group.permissions" :key="permission.slug">
              {{ permission.name }}
              <span class="text-admin-muted/80 text-xs">({{ permission.slug }})</span>
            </li>
          </ul>
        </div>
      </div>
    </AdminCard>

    <AdminRolePermissionsModal
      v-if="can('roles.assign')"
      v-model="permissionsOpen"
      :role="selectedRole"
      :permissions="permissions ?? []"
    />
  </div>
</template>
