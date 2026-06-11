import type {
  StoreCheckoutQuote,
  StoreCheckoutQuotePayload,
  StoreCheckoutSettings,
  StorePlaceOrderPayload,
  StorePlaceOrderResult,
} from '~/types/store-checkout'

export async function fetchStoreCheckoutSettings() {
  const { data } = await useApi().get<StoreCheckoutSettings>(
    '/store/checkout/settings',
  )
  return data
}

export async function fetchStoreCheckoutQuote(payload: StoreCheckoutQuotePayload) {
  const { data } = await useApi().post<StoreCheckoutQuote>(
    '/store/checkout/quote',
    payload,
  )
  return data
}

export async function placeStoreOrder(payload: StorePlaceOrderPayload) {
  const { data } = await useApi().post<StorePlaceOrderResult>(
    '/store/checkout/orders',
    payload,
  )
  return data
}
