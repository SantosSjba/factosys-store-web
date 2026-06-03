import { defineStore } from 'pinia'
import type {
  AuthTokensResponse,
  AuthUser,
  LoginPayload,
  RegisterPayload,
  RegisterResponse,
  StoreProfile,
} from '~/types/auth'

const ACCESS_COOKIE = 'fs_access_token'
const REFRESH_COOKIE = 'fs_refresh_token'

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
    const api = useApi()
    return api<RegisterResponse>('/store/auth/register', {
      method: 'POST',
      body: payload,
      auth: false,
    })
  }

  async function verifyEmail(token: string) {
    const api = useApi()
    const tokens = await api<AuthTokensResponse>('/store/auth/verify-email', {
      method: 'POST',
      body: { token },
      auth: false,
    })
    setSession(tokens)
    return tokens
  }

  async function login(payload: LoginPayload) {
    const api = useApi()
    const tokens = await api<AuthTokensResponse>('/store/auth/login', {
      method: 'POST',
      body: payload,
      auth: false,
    })
    setSession(tokens)
    return tokens
  }

  async function refreshSession() {
    if (!refreshToken.value) {
      throw new Error('No hay sesión activa')
    }
    const api = useApi()
    const tokens = await api<AuthTokensResponse>('/store/auth/refresh', {
      method: 'POST',
      body: { refreshToken: refreshToken.value },
      auth: false,
    })
    setSession(tokens)
    return tokens
  }

  async function logout() {
    if (refreshToken.value) {
      try {
        const api = useApi()
        await api<{ message: string }>('/store/auth/logout', {
          method: 'POST',
          body: { refreshToken: refreshToken.value },
          auth: false,
        })
      } catch {
        // Ignorar errores de red al cerrar sesión localmente
      }
    }
    clearSession()
  }

  async function fetchProfile() {
    const api = useApi()
    profile.value = await api<StoreProfile>('/store/me')
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
      if (profile.value) {
        user.value = {
          id: profile.value.id,
          email: profile.value.email,
          userType: profile.value.userType,
          firstName: profile.value.firstName,
          lastName: profile.value.lastName,
          roles: profile.value.roles,
        }
      }
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
    // OAuth debe ir al backend real (no al proxy del navegador en todos los casos)
    if (base.startsWith('http')) {
      return `${base}/store/auth/google`
    }
    const origin = config.public.apiOrigin.replace(/\/$/, '')
    return `${origin}/api/store/auth/google`
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
