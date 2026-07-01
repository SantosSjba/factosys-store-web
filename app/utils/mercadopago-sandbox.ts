export const MERCADOPAGO_SANDBOX_PAYER_EMAIL = 'test@testuser.com'

export function resolveMercadoPagoPayerEmail(
  email: string,
  isTestMode?: boolean,
) {
  const normalized = email.trim().toLowerCase()
  if (!isTestMode) return email.trim()
  if (normalized.includes('@testuser.com')) return email.trim()
  return MERCADOPAGO_SANDBOX_PAYER_EMAIL
}
