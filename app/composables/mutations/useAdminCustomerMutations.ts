import { useMutation, useQueryClient } from '@tanstack/vue-query'
import {
  createAdminCustomer,
  softDeleteAdminCustomer,
  updateAdminCustomer,
} from '~/api/admin-customers.api'
import { adminQueryKeys } from '~/constants/query-keys'
import type {
  CreateCustomerPayload,
  UpdateCustomerPayload,
} from '~/types/admin-customers'

export function useAdminCreateCustomerMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateCustomerPayload) => createAdminCustomer(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.customers() })
    },
  })
}

export function useAdminUpdateCustomerMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: UpdateCustomerPayload
    }) => updateAdminCustomer(id, payload),
    onSuccess: (customer) => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.customers() })
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.customer(customer.id),
      })
    },
  })
}

export function useAdminDeleteCustomerMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => softDeleteAdminCustomer(id),
    onSuccess: (customer) => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.customers() })
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.customer(customer.id),
      })
    },
  })
}
