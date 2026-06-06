import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { softDeleteAdminCustomer } from '~/api/admin-customers.api'
import { adminQueryKeys } from '~/constants/query-keys'

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
