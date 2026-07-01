import { useQuery } from '@tanstack/vue-query'
import { fetchMercadoPagoConfig } from '~/api/store-mercadopago.api'
import { storeQueryKeys } from '~/constants/query-keys'

export function useMercadoPagoConfigQuery() {
  return useQuery({
    queryKey: storeQueryKeys.mercadoPagoConfig(),
    queryFn: fetchMercadoPagoConfig,
    staleTime: 5 * 60 * 1000,
  })
}
