import type { LoginAuditEntry } from '~/types/admin-login-audit'
import type { AuthTokensResponse, LoginPayload } from '~/types/auth'

export async function loginAdminUser(
  payload: LoginPayload,
): Promise<AuthTokensResponse> {
  const { data } = await useAdminApi().post<AuthTokensResponse>(
    '/admin/auth/login',
    payload,
    { withAuth: false },
  )
  return data
}

export async function refreshAdminSession(
  refreshToken: string,
): Promise<AuthTokensResponse> {
  const { data } = await useAdminApi().post<AuthTokensResponse>(
    '/admin/auth/refresh',
    { refreshToken },
    { withAuth: false, skipRefresh: true },
  )
  return data
}

export async function logoutAdminSession(refreshToken: string) {
  const { data } = await useAdminApi().post<{ message: string }>(
    '/admin/auth/logout',
    { refreshToken },
    { withAuth: false },
  )
  return data
}

export async function fetchAdminLoginAudit() {
  const { data } = await useAdminApi().get<LoginAuditEntry[]>(
    '/admin/auth/login-audit',
  )
  return data
}
