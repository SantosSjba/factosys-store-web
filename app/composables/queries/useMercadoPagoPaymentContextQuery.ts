import { useQuery } from '@tanstack/vue-query'
import { fetchMercadoPagoPaymentContext } from '~/api/store-mercadopago.api'
import { storeQueryKeys } from '~/constants/query-keys'
import type { MercadoPagoPaymentContext } from '~/types/store-checkout'

export function useMercadoPagoPaymentContextQuery(
  orderId: MaybeRefOrGetter<string>,
  guestEmail: MaybeRefOrGetter<string | undefined> = undefined,
) {
  const authStore = useAuthStore()
  const resolvedId = computed(() => toValue(orderId).trim())
  const resolvedGuestEmail = computed(() => toValue(guestEmail)?.trim())

  return useQuery<MercadoPagoPaymentContext>({
    queryKey: computed(() =>
      storeQueryKeys.mercadoPagoPaymentContext(
        resolvedId.value,
        authStore.isAuthenticated ? undefined : resolvedGuestEmail.value,
      ),
    ),
    queryFn: () =>
      fetchMercadoPagoPaymentContext(
        resolvedId.value,
        authStore.isAuthenticated ? undefined : resolvedGuestEmail.value,
      ),
    enabled: computed(() => {
      if (!resolvedId.value) return false
      if (authStore.isAuthenticated) return true
      return Boolean(resolvedGuestEmail.value)
    }),
    staleTime: 30 * 1000,
  })
}
