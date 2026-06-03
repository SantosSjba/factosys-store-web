import type {
  AuthTokensResponse,
  LoginPayload,
  RegisterPayload,
  RegisterResponse,
} from '~/types/auth'

export async function registerStoreUser(payload: RegisterPayload) {
  const { data } = await useApi().post<RegisterResponse>(
    '/store/auth/register',
    payload,
    { auth: false },
  )
  return data
}

export async function verifyStoreEmail(token: string) {
  const { data } = await useApi().post<AuthTokensResponse>(
    '/store/auth/verify-email',
    { token },
    { auth: false },
  )
  return data
}

export async function loginStoreUser(payload: LoginPayload) {
  const { data } = await useApi().post<AuthTokensResponse>(
    '/store/auth/login',
    payload,
    { auth: false },
  )
  return data
}

export async function refreshStoreSession(refreshToken: string) {
  const { data } = await useApi().post<AuthTokensResponse>(
    '/store/auth/refresh',
    { refreshToken },
    { auth: false, skipRefresh: true },
  )
  return data
}

export async function logoutStoreSession(refreshToken: string) {
  const { data } = await useApi().post<{ message: string }>(
    '/store/auth/logout',
    { refreshToken },
    { auth: false },
  )
  return data
}
