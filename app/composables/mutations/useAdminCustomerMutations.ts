import { useMutation, useQueryClient } from '@tanstack/vue-query'
import {
  createAdminCustomer,
  softDeleteAdminCustomer,
} from '~/api/admin-customers.api'
import { adminQueryKeys } from '~/constants/query-keys'
import type { CreateCustomerPayload } from '~/types/admin-customers'

export function useAdminCreateCustomerMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateCustomerPayload) => createAdminCustomer(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.customers() })
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
