<script setup lang="ts">
import type { UiTableColumn } from '~/types/ui'
import type { StoreCustomer } from '~/types/admin-customers'

const { can } = useAdminPermissions()
const deleteMutation = useAdminDeleteCustomerMutation()

const {
  page,
  search,
  isPending,
  items: customers,
  paginationMeta,
} = usePaginatedAdminList<StoreCustomer>((params) =>
  useAdminCustomersQuery(params),
)

const createOpen = ref(false)
const detailOpen = ref(false)
const editOpen = ref(false)
const selectedCustomer = ref<StoreCustomer | null>(null)

const columns: UiTableColumn<StoreCustomer>[] = [
  { key: 'email', label: 'Correo' },
  { key: 'firstName', label: 'Nombre' },
  { key: 'authProvider', label: 'Acceso', width: '9rem' },
  { key: 'emailVerifiedAt', label: 'Verificado', width: '8rem' },
  { key: 'status', label: 'Estado', width: '8rem' },
  { key: 'createdAt', label: 'Alta', width: '9rem' },
]

function openDetail(customer: StoreCustomer) {
  selectedCustomer.value = customer
  detailOpen.value = true
}

function openEdit(customer: StoreCustomer) {
  selectedCustomer.value = customer
  editOpen.value = true
}

function openEditFromDetail() {
  detailOpen.value = false
  editOpen.value = true
}

function suspendCustomer(customer: StoreCustomer) {
  const name = formatUserName(customer) || customer.email
  return runAdminSuspendAction({
    confirm: {
      title: 'Dar de baja cliente',
      message: `¿Suspender a ${name}? No podrá iniciar sesión en la tienda.`,
      confirmLabel: 'Dar de baja',
    },
    mutate: () => deleteMutation.mutateAsync(customer.id),
    successMessage: 'Cliente dado de baja correctamente',
  })
}
</script>

<template>
  <div>
    <UiFilterBar title="Clientes de la tienda">
      <UiSearchInput
        v-model="search"
        placeholder="Buscar por correo, nombre o teléfono…"
        class="min-w-[16rem] flex-1"
      />
      <template #actions>
        <UiButton
          v-if="can('users.create')"
          @click="createOpen = true"
        >
          <UiIcon name="lucide:user-plus" :size="16" class="mr-2" />
          Nuevo cliente
        </UiButton>
      </template>
    </UiFilterBar>

    <AdminCard no-padding>
      <UiDataTable
        :columns="columns"
        :rows="customers"
        :loading="isPending"
        empty-title="Sin clientes"
        empty-description="Aún no hay clientes registrados en la tienda."
      >
        <template #cell-firstName="{ row }">
          {{ formatUserName(row) }}
        </template>

        <template #cell-authProvider="{ row }">
          <div class="flex items-center gap-1.5">
            <UiIcon
              :name="row.authProvider === 'GOOGLE' ? 'mdi:google' : 'lucide:key-round'"
              :size="14"
              class="text-admin-muted shrink-0"
            />
            <span class="text-sm">{{ formatAuthProvider(row.authProvider) }}</span>
          </div>
        </template>

        <template #cell-emailVerifiedAt="{ row }">
          <UiBadge
            :variant="emailVerifiedVariant(row.emailVerifiedAt)"
            class="normal-case"
          >
            {{ formatEmailVerified(row.emailVerifiedAt) }}
          </UiBadge>
        </template>

        <template #cell-status="{ row }">
          <UiBadge :variant="userStatusVariant(row.status)" class="normal-case">
            {{ formatUserStatus(row.status) }}
          </UiBadge>
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
              ariaLabel="Editar cliente"
              title="Editar cliente"
              size="sm"
              tone="admin"
              @click="openEdit(row)"
            />
            <UiIconButton
              v-if="can('users.delete') && row.status !== 'SUSPENDED'"
              icon="lucide:user-x"
              ariaLabel="Dar de baja"
              title="Dar de baja"
              size="sm"
              tone="admin"
              @click="suspendCustomer(row)"
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

    <AdminCustomerCreateModal
      v-if="can('users.create')"
      v-model="createOpen"
    />

    <AdminCustomerDetailModal
      v-model="detailOpen"
      :customer="selectedCustomer"
      @edit="openEditFromDetail"
    />

    <AdminCustomerEditModal
      v-if="can('users.update')"
      v-model="editOpen"
      :customer="selectedCustomer"
    />
  </div>
</template>
