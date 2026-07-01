import { useQuery } from '@tanstack/vue-query'
import {
  fetchAdminPaymentGateways,
  fetchAdminPaymentTransactions,
  fetchMercadoPagoWebhookSetup,
} from '~/api/admin-payment-gateways.api'
import { adminQueryKeys } from '~/constants/query-keys'

export function useAdminPaymentGatewaysQuery() {
  const adminAuth = useAdminAuthStore()
  const { can } = useAdminPermissions()

  return useQuery({
    queryKey: adminQueryKeys.paymentGateways(),
    queryFn: fetchAdminPaymentGateways,
    enabled: computed(() => {
      if (!adminAuth.accessToken) return false
      if (!adminAuth.profile) return true
      return can('settings.read')
    }),
  })
}

export function useAdminMercadoPagoWebhookSetupQuery(enabled: MaybeRefOrGetter<boolean>) {
  const adminAuth = useAdminAuthStore()
  const { can } = useAdminPermissions()

  return useQuery({
    queryKey: adminQueryKeys.mercadoPagoWebhookSetup(),
    queryFn: fetchMercadoPagoWebhookSetup,
    enabled: computed(() => {
      if (!toValue(enabled)) return false
      if (!adminAuth.accessToken) return false
      if (!adminAuth.profile) return true
      return can('settings.read')
    }),
  })
}

export function useAdminPaymentTransactionsQuery(orderId?: MaybeRefOrGetter<string | undefined>) {
  const adminAuth = useAdminAuthStore()
  const { can } = useAdminPermissions()
  const orderIdRef = computed(() => toValue(orderId))

  return useQuery({
    queryKey: computed(() => adminQueryKeys.paymentTransactions(orderIdRef.value)),
    queryFn: () => fetchAdminPaymentTransactions(orderIdRef.value),
    enabled: computed(() => {
      if (!adminAuth.accessToken) return false
      if (!adminAuth.profile) return true
      return can('orders.read')
    }),
  })
}
