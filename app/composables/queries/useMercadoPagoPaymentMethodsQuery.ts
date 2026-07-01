import { useQuery } from '@tanstack/vue-query'
import type { MaybeRefOrGetter } from 'vue'
import { toValue } from 'vue'
import { fetchMercadoPagoPaymentMethods } from '~/api/store-mercadopago.api'
import { storeQueryKeys } from '~/constants/query-keys'

export function useMercadoPagoPaymentMethodsQuery(
  enabled: MaybeRefOrGetter<boolean> = true,
) {
  return useQuery({
    queryKey: storeQueryKeys.mercadoPagoPaymentMethods(),
    queryFn: fetchMercadoPagoPaymentMethods,
    staleTime: 5 * 60 * 1000,
    enabled: () => toValue(enabled),
  })
}
