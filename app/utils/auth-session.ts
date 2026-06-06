import type { useAdminAuthStore } from '~/stores/admin-auth'
import type { useAuthStore } from '~/stores/auth'

type StoreAuth = ReturnType<typeof useAuthStore>
type AdminAuth = ReturnType<typeof useAdminAuthStore>

export function hasStoreSession(auth: StoreAuth) {
  return Boolean(auth.accessToken || auth.refreshToken)
}

export function hasAdminSession(adminAuth: AdminAuth) {
  return Boolean(adminAuth.accessToken || adminAuth.refreshToken)
}

export async function ensureStoreSession(auth: StoreAuth) {
  if (!hasStoreSession(auth)) return false
  if (!auth.user) await auth.hydrateFromTokens()
  return auth.isAuthenticated
}

export async function ensureAdminSession(adminAuth: AdminAuth) {
  if (!hasAdminSession(adminAuth)) return false
  if (!adminAuth.user) await adminAuth.hydrateFromTokens()
  return adminAuth.isAuthenticated
}
