import { defineStore } from 'pinia'
import {
  loginStoreUser,
  logoutStoreSession,
  refreshStoreSession,
  registerStoreUser,
  verifyStoreEmail,
} from '~/api/store-auth.api'
import { fetchStoreProfile } from '~/api/store-profile.api'
import type {
  AuthTokensResponse,
  AuthUser,
  LoginPayload,
  RegisterPayload,
  RegisterResponse,
  StoreProfile,
  VerifyEmailPayload,
} from '~/types/auth'

const ACCESS_COOKIE = 'fs_access_token'
const REFRESH_COOKIE = 'fs_refresh_token'

function profileToUser(profile: StoreProfile): AuthUser {
  return {
    id: profile.id,
    email: profile.email,
    userType: profile.userType,
    firstName: profile.firstName,
    lastName: profile.lastName,
    roles: ['customer'],
  }
}

export const useAuthStore = defineStore('auth', () => {
  const accessToken = useCookie<string | null>(ACCESS_COOKIE, {
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax',
  })
  const refreshToken = useCookie<string | null>(REFRESH_COOKIE, {
    maxAge: 60 * 60 * 24 * 30,
    sameSite: 'lax',
  })

  const user = ref<AuthUser | null>(null)
  const profile = ref<StoreProfile | null>(null)

  const isAuthenticated = computed(
    () => Boolean(accessToken.value && user.value),
  )

  function setSession(tokens: AuthTokensResponse) {
    accessToken.value = tokens.accessToken
    refreshToken.value = tokens.refreshToken
    user.value = tokens.user
  }

  function clearSession() {
    accessToken.value = null
    refreshToken.value = null
    user.value = null
    profile.value = null
  }

  async function register(payload: RegisterPayload) {
    return registerStoreUser(payload)
  }

  async function verifyEmail(payload: VerifyEmailPayload) {
    const tokens = await verifyStoreEmail(payload)
    setSession(tokens)
    return tokens
  }

  /** Compatibilidad; preferir `useStoreLoginMutation` en páginas. */
  async function login(payload: LoginPayload) {
    const tokens = await loginStoreUser(payload)
    setSession(tokens)
    return tokens
  }

  async function refreshSession(): Promise<AuthTokensResponse> {
    if (!refreshToken.value) {
      throw new Error('No hay sesión activa')
    }
    const tokens = await refreshStoreSession(refreshToken.value)
    setSession(tokens)
    return tokens
  }

  async function logout() {
    if (refreshToken.value) {
      try {
        await logoutStoreSession(refreshToken.value)
      } catch {
        // Ignorar errores de red al cerrar sesión localmente
      }
    }
    clearSession()
  }

  async function fetchProfile() {
    profile.value = await fetchStoreProfile()
    user.value = profileToUser(profile.value)
    return profile.value
  }

  function setTokensFromCallback(access: string, refresh: string) {
    accessToken.value = access
    refreshToken.value = refresh
    user.value = null
  }

  async function hydrateFromTokens() {
    if (!accessToken.value) return
    try {
      await fetchProfile()
    } catch {
      if (refreshToken.value) {
        try {
          await refreshSession()
          await fetchProfile()
        } catch {
          clearSession()
        }
      } else {
        clearSession()
      }
    }
  }

  const googleAuthUrl = computed(() => {
    const config = useRuntimeConfig()
    const base = config.public.apiBaseUrl.replace(/\/$/, '')
    if (base.startsWith('http')) {
      return `${base}/store/auth/google`
    }
    // Misma origen (Nuxt :3001): el proxy de Vite reenvía a la API
    return `${base}/store/auth/google`
  })

  return {
    accessToken,
    refreshToken,
    user,
    profile,
    isAuthenticated,
    googleAuthUrl,
    setSession,
    clearSession,
    register,
    verifyEmail,
    login,
    refreshSession,
    logout,
    fetchProfile,
    setTokensFromCallback,
    hydrateFromTokens,
  }
})
