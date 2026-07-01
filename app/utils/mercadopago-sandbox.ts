import type { MercadoPagoSandboxPayerEmailMode } from '~/types/store-checkout'

export type { MercadoPagoSandboxPayerEmailMode }

export const MERCADOPAGO_SANDBOX_PAYER_EMAIL = 'test@testuser.com'

/**
 * Genera un correo determinístico con el formato exigido por Mercado Pago
 * para compradores de prueba en la API de Órdenes: test_payer_[0-9]{1,10}@testuser.com.
 * El correo marcador genérico (test@testuser.com) solo aplica cuando el vendedor
 * usa credenciales de producción; con una cuenta test_user completa, MP exige este patrón.
 */
export function buildSyntheticTestPayerEmail(orderId: string) {
  let hash = 0
  for (let i = 0; i < orderId.length; i += 1) {
    hash = (hash * 31 + orderId.charCodeAt(i)) % 10_000_000_000
  }
  const digits = String(Math.abs(hash)).padStart(6, '0').slice(0, 10)
  return `test_payer_${digits}@testuser.com`
}

export function resolveMercadoPagoPayerEmail(
  orderId: string,
  email: string,
  isTestMode?: boolean,
  mode: MercadoPagoSandboxPayerEmailMode = 'testuser',
) {
  if (!isTestMode) return email.trim()
  if (mode === 'order') return email.trim()
  if (mode === 'synthetic') return buildSyntheticTestPayerEmail(orderId)
  return MERCADOPAGO_SANDBOX_PAYER_EMAIL
}
