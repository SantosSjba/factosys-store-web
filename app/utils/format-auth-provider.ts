import type { CustomerAuthProvider } from '~/types/admin-customers'

const PROVIDER_LABELS: Record<CustomerAuthProvider, string> = {
  LOCAL: 'Correo y contraseña',
  GOOGLE: 'Google',
}

export function formatAuthProvider(provider: string): string {
  return PROVIDER_LABELS[provider as CustomerAuthProvider] ?? provider
}
