<script setup lang="ts">
import type { UiTableColumn } from '~/types/ui'
import type { StaffUser } from '~/types/admin-users'

const { can } = useAdminPermissions()
const { data: profile } = useAdminProfileQuery()
const deleteMutation = useAdminDeleteUserMutation()
const updateMutation = useAdminUpdateUserMutation()

const currentUserId = computed(() => profile.value?.id ?? '')

const {
  page,
  search,
  isPending,
  items: users,
  paginationMeta,
} = usePaginatedAdminList<StaffUser>((params) =>
  useAdminUsersQuery(params),
)

const { data: roles } = useAdminRolesQuery()

const createOpen = ref(false)
const detailOpen = ref(false)
const editOpen = ref(false)
const selectedUser = ref<StaffUser | null>(null)

const columns: UiTableColumn<StaffUser>[] = [
  { key: 'email', label: 'Correo' },
  { key: 'firstName', label: 'Nombre' },
  { key: 'roles', label: 'Roles' },
  { key: 'status', label: 'Estado', width: '8rem' },
  { key: 'permissions', label: 'Permisos', align: 'center', width: '6rem' },
  { key: 'createdAt', label: 'Alta', width: '9rem' },
]

function openDetail(user: StaffUser) {
  selectedUser.value = user
  detailOpen.value = true
}

function openEdit(user: StaffUser) {
  selectedUser.value = user
  editOpen.value = true
}

function openEditFromDetail() {
  detailOpen.value = false
  editOpen.value = true
}

function canManageStatus(user: StaffUser) {
  return user.id !== currentUserId.value
}

function suspendUser(user: StaffUser) {
  const name = formatUserName(user) || user.email
  return runAdminSuspendAction({
    confirm: {
      title: 'Dar de baja usuario',
      message: `¿Suspender a ${name}? No podrá iniciar sesión y sus sesiones activas se cerrarán.`,
      confirmLabel: 'Dar de baja',
    },
    mutate: () => deleteMutation.mutateAsync(user.id),
    successMessage: 'Usuario dado de baja correctamente',
  })
}

function reactivateUser(user: StaffUser) {
  const name = formatUserName(user) || user.email
  return runAdminSuspendAction({
    confirm: {
      title: 'Reactivar usuario',
      message: `¿Reactivar a ${name}? Podrá volver a acceder al panel.`,
      confirmLabel: 'Reactivar',
      variant: 'primary',
    },
    mutate: () =>
      updateMutation.mutateAsync({
        id: user.id,
        payload: { status: 'ACTIVE' },
      }),
    successMessage: 'Usuario reactivado correctamente',
  })
}
</script>

<template>
  <div>
    <UiFilterBar title="Personal del sistema">
      <UiSearchInput
        v-model="search"
        placeholder="Buscar por correo, nombre o rol…"
        class="min-w-[16rem] flex-1"
      />
      <template #actions>
        <UiButton
          v-if="can('users.create')"
          @click="createOpen = true"
        >
          <UiIcon name="lucide:user-plus" :size="16" class="mr-2" />
          Nuevo usuario
        </UiButton>
      </template>
    </UiFilterBar>

    <AdminCard no-padding>
      <UiDataTable
        :columns="columns"
        :rows="users"
        :loading="isPending"
        empty-title="Sin usuarios staff"
        empty-description="Crea el primer usuario del panel administrativo."
      >
        <template #cell-firstName="{ row }">
          {{ formatUserName(row) }}
        </template>

        <template #cell-roles="{ row }">
          <div class="flex flex-wrap gap-1">
            <UiBadge
              v-for="role in row.roles"
              :key="role.slug"
              variant="primary"
              class="normal-case"
            >
              {{ role.name }}
            </UiBadge>
            <span v-if="!row.roles.length" class="text-admin-muted text-sm">—</span>
          </div>
        </template>

        <template #cell-status="{ row }">
          <UiBadge :variant="userStatusVariant(row.status)" class="normal-case">
            {{ formatUserStatus(row.status) }}
          </UiBadge>
        </template>

        <template #cell-permissions="{ row }">
          {{ row.permissions.length }}
        </template>

        <template #cell-createdAt="{ row }">
          {{ formatAdminDate(row.createdAt) }}
        </template>

        <template #actions="{ row }">
          <div class="flex justify-end gap-0.5">
            <UiIconButton
              icon="lucide:eye"
              ariaLabel="Ver detalle"
              title="Ver detalle"
              size="sm"
              tone="admin"
              @click="openDetail(row)"
            />
            <UiIconButton
              v-if="can('users.update')"
              icon="lucide:pencil"
              ariaLabel="Editar usuario"
              title="Editar usuario"
              size="sm"
              tone="admin"
              @click="openEdit(row)"
            />
            <UiIconButton
              v-if="can('users.delete') && canManageStatus(row) && row.status !== 'SUSPENDED'"
              icon="lucide:user-x"
              ariaLabel="Dar de baja"
              title="Dar de baja"
              size="sm"
              tone="admin"
              @click="suspendUser(row)"
            />
            <UiIconButton
              v-if="can('users.update') && canManageStatus(row) && row.status === 'SUSPENDED'"
              icon="lucide:user-check"
              ariaLabel="Reactivar usuario"
              title="Reactivar usuario"
              size="sm"
              tone="admin"
              @click="reactivateUser(row)"
            />
          </div>
        </template>
      </UiDataTable>

      <div v-if="paginationMeta && paginationMeta.total > 0" class="border-admin-line border-t p-4">
        <UiPagination
          :page="paginationMeta.page"
          :page-size="paginationMeta.limit"
          :total="paginationMeta.total"
          tone="admin"
          @update:page="page = $event"
        />
      </div>
    </AdminCard>

    <AdminUserCreateModal
      v-if="can('users.create')"
      v-model="createOpen"
      :roles="roles ?? []"
    />

    <AdminUserDetailModal
      v-model="detailOpen"
      :user="selectedUser"
      @edit="openEditFromDetail"
    />

    <AdminUserEditModal
      v-if="can('users.update')"
      v-model="editOpen"
      :user="selectedUser"
      :roles="roles ?? []"
    />
  </div>
</template>
