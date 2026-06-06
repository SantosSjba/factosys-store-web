import type {
  CreateCustomerPayload,
  StoreCustomer,
  UpdateCustomerPayload,
} from '~/types/admin-customers'
import type { PaginatedResponse, PaginationParams } from '~/types/pagination'

export async function fetchAdminCustomers(params: PaginationParams = {}) {
  const { data } = await useAdminApi().get<PaginatedResponse<StoreCustomer>>(
    '/admin/customers',
    { params },
  )
  return data
}

export async function createAdminCustomer(payload: CreateCustomerPayload) {
  const { data } = await useAdminApi().post<StoreCustomer>('/admin/customers', payload)
  return data
}

export async function fetchAdminCustomer(id: string) {
  const { data } = await useAdminApi().get<StoreCustomer>(`/admin/customers/${id}`)
  return data
}

export async function updateAdminCustomer(id: string, payload: UpdateCustomerPayload) {
  const { data } = await useAdminApi().patch<StoreCustomer>(
    `/admin/customers/${id}`,
    payload,
  )
  return data
}

export async function softDeleteAdminCustomer(id: string) {
  const { data } = await useAdminApi().delete<StoreCustomer>(`/admin/customers/${id}`)
  return data
}
