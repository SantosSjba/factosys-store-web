export const MERCADOPAGO_SANDBOX_PAYER_EMAIL = 'test@testuser.com'

export function resolveMercadoPagoPayerEmail(
  email: string,
  isTestMode?: boolean,
) {
  if (isTestMode) return MERCADOPAGO_SANDBOX_PAYER_EMAIL
  return email.trim()
}
