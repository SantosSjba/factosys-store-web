import type {
  AuthTokensResponse,
  LoginPayload,
  RegisterPayload,
  RegisterResponse,
  ResendVerificationResponse,
  VerifyEmailPayload,
} from '~/types/auth'

export async function registerStoreUser(
  payload: RegisterPayload,
): Promise<RegisterResponse> {
  const { data } = await useApi().post<RegisterResponse>(
    '/store/auth/register',
    payload,
    { auth: false },
  )
  return data
}

export async function verifyStoreEmail(
  payload: VerifyEmailPayload,
): Promise<AuthTokensResponse> {
  const { data } = await useApi().post<AuthTokensResponse>(
    '/store/auth/verify-email',
    payload,
    { auth: false },
  )
  return data
}

export async function resendStoreVerification(
  email: string,
): Promise<ResendVerificationResponse> {
  const { data } = await useApi().post<ResendVerificationResponse>(
    '/store/auth/resend-verification',
    { email },
    { auth: false },
  )
  return data
}

export async function loginStoreUser(
  payload: LoginPayload,
): Promise<AuthTokensResponse> {
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
