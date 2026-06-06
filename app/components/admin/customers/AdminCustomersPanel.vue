<script setup lang="ts">
import type { UiTableColumn } from '~/types/ui'
import type { StoreCustomer } from '~/types/admin-customers'

const { can } = useAdminPermissions()
const { confirm } = useConfirm()
const deleteMutation = useAdminDeleteCustomerMutation()

const page = ref(1)
const pageSize = ref(10)
const search = ref('')

const customersQuery = useAdminCustomersQuery(
  computed(() => ({
    page: page.value,
    limit: pageSize.value,
    search: search.value,
  })),
)

const isPending = computed(() => customersQuery.isPending.value)
const isError = computed(() => customersQuery.isError.value)
const error = computed(() => customersQuery.error.value)
const customers = computed(() => customersQuery.data.value?.items ?? [])
const paginationMeta = computed(() => customersQuery.data.value?.meta)

const createOpen = ref(false)
const detailOpen = ref(false)
const selectedCustomer = ref<StoreCustomer | null>(null)

useQueryErrorToast(isError, error)

const columns: UiTableColumn<StoreCustomer>[] = [
  { key: 'email', label: 'Correo' },
  { key: 'firstName', label: 'Nombre' },
  { key: 'authProvider', label: 'Acceso', width: '9rem' },
  { key: 'status', label: 'Estado', width: '8rem' },
  { key: 'createdAt', label: 'Alta', width: '9rem' },
]

watch(search, () => {
  page.value = 1
})

function openDetail(customer: StoreCustomer) {
  selectedCustomer.value = customer
  detailOpen.value = true
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

async function suspendCustomer(customer: StoreCustomer) {
  const name = formatUserName(customer) || customer.email
  const ok = await confirm({
    title: 'Dar de baja cliente',
    message: `¿Suspender a ${name}? No podrá iniciar sesión en la tienda.`,
    confirmLabel: 'Dar de baja',
    variant: 'danger',
  })

  if (!ok) return

  try {
    await deleteMutation.mutateAsync(customer.id)
    useToast().success('Cliente dado de baja correctamente')
  } catch (error) {
    useToast().error(useApiErrorMessage(error))
  }
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

        <template #cell-status="{ row }">
          <UiBadge :variant="userStatusVariant(row.status)" class="normal-case">
            {{ formatUserStatus(row.status) }}
          </UiBadge>
        </template>

        <template #cell-createdAt="{ row }">
          {{ formatDate(row.createdAt) }}
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
    />
  </div>
</template>
