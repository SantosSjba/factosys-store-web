<script setup lang="ts">
import type { UiTableColumn } from '~/types/ui'
import type { StaffUser } from '~/types/admin-users'

const { can } = useAdminPermissions()
const { data: profile } = useAdminProfileQuery()
const confirm = useConfirm()
const deleteMutation = useAdminDeleteUserMutation()
const updateMutation = useAdminUpdateUserMutation()

const currentUserId = computed(() => profile.value?.id ?? '')

const page = ref(1)
const pageSize = ref(10)
const search = ref('')

const usersQuery = useAdminUsersQuery(
  computed(() => ({
    page: page.value,
    limit: pageSize.value,
    search: search.value,
  })),
)

const { data: roles } = useAdminRolesQuery()

const isPending = computed(() => usersQuery.isPending.value)
const isError = computed(() => usersQuery.isError.value)
const error = computed(() => usersQuery.error.value)
const users = computed(() => usersQuery.data.value?.items ?? [])
const paginationMeta = computed(() => usersQuery.data.value?.meta)

const createOpen = ref(false)
const detailOpen = ref(false)
const editOpen = ref(false)
const selectedUser = ref<StaffUser | null>(null)

const errorMessage = computed(() =>
  isError.value ? useApiErrorMessage(error.value) : '',
)

const columns: UiTableColumn<StaffUser>[] = [
  { key: 'email', label: 'Correo' },
  { key: 'firstName', label: 'Nombre' },
  { key: 'roles', label: 'Roles' },
  { key: 'status', label: 'Estado', width: '8rem' },
  { key: 'permissions', label: 'Permisos', align: 'center', width: '6rem' },
  { key: 'createdAt', label: 'Alta', width: '9rem' },
]

watch(search, () => {
  page.value = 1
})

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

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function canManageStatus(user: StaffUser) {
  return user.id !== currentUserId.value
}

async function suspendUser(user: StaffUser) {
  const name = formatUserName(user) || user.email
  const ok = await confirm({
    title: 'Dar de baja usuario',
    message: `¿Suspender a ${name}? No podrá iniciar sesión y sus sesiones activas se cerrarán.`,
    confirmLabel: 'Dar de baja',
    variant: 'danger',
  })

  if (!ok) return

  try {
    await deleteMutation.mutateAsync(user.id)
    useToast().success('Usuario dado de baja correctamente')
  } catch (error) {
    useToast().error(useApiErrorMessage(error))
  }
}

async function reactivateUser(user: StaffUser) {
  const name = formatUserName(user) || user.email
  const ok = await confirm({
    title: 'Reactivar usuario',
    message: `¿Reactivar a ${name}? Podrá volver a acceder al panel.`,
    confirmLabel: 'Reactivar',
    variant: 'primary',
  })

  if (!ok) return

  try {
    await updateMutation.mutateAsync({
      id: user.id,
      payload: { status: 'ACTIVE' },
    })
    useToast().success('Usuario reactivado correctamente')
  } catch (error) {
    useToast().error(useApiErrorMessage(error))
  }
}
</script>

<template>
  <div>
    <UiAlert v-if="errorMessage" variant="error" class="mb-4">
      {{ errorMessage }}
    </UiAlert>

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
          {{ formatDate(row.createdAt) }}
        </template>

        <template #actions="{ row }">
          <div class="flex justify-end gap-0.5">
            <UiIconButton
              icon="lucide:eye"
              aria-label="Ver detalle"
              title="Ver detalle"
              size="sm"
              tone="admin"
              @click="openDetail(row)"
            />
            <UiIconButton
              v-if="can('users.update')"
              icon="lucide:pencil"
              aria-label="Editar usuario"
              title="Editar usuario"
              size="sm"
              tone="admin"
              @click="openEdit(row)"
            />
            <UiIconButton
              v-if="can('users.delete') && canManageStatus(row) && row.status !== 'SUSPENDED'"
              icon="lucide:user-x"
              aria-label="Dar de baja"
              title="Dar de baja"
              size="sm"
              tone="admin"
              @click="suspendUser(row)"
            />
            <UiIconButton
              v-if="can('users.update') && canManageStatus(row) && row.status === 'SUSPENDED'"
              icon="lucide:user-check"
              aria-label="Reactivar usuario"
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
