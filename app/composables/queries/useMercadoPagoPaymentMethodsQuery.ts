import { useQuery } from '@tanstack/vue-query'
import { fetchMercadoPagoPaymentMethods } from '~/api/store-mercadopago.api'
import { storeQueryKeys } from '~/constants/query-keys'

export function useMercadoPagoPaymentMethodsQuery(enabled = true) {
  return useQuery({
    queryKey: storeQueryKeys.mercadoPagoPaymentMethods(),
    queryFn: fetchMercadoPagoPaymentMethods,
    staleTime: 5 * 60 * 1000,
    enabled,
  })
}
