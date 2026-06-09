import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { updateAdminPaymentGateway } from '~/api/admin-payment-gateways.api'
import { adminQueryKeys } from '~/constants/query-keys'
import type {
  PaymentGatewayProvider,
  UpdatePaymentGatewayPayload,
} from '~/types/admin-payment-gateways'

export function useAdminUpdatePaymentGatewayMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      provider,
      payload,
    }: {
      provider: PaymentGatewayProvider
      payload: UpdatePaymentGatewayPayload
    }) => updateAdminPaymentGateway(provider, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.paymentGateways() })
    },
  })
}
