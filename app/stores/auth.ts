import { useQueryClient } from '@tanstack/vue-query'
import { defineStore } from 'pinia'
import { storeQueryKeys } from '~/constants/query-keys'
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
import { isAccessTokenExpiringSoon } from '~/utils/jwt'
import { parseApiError } from '~/utils/parse-api-error'

const ACCESS_COOKIE = 'fs_access_token'
const REFRESH_COOKIE = 'fs_refresh_token'

function isAuthFailure(error: unknown) {
  const apiError = parseApiError(error)
  return apiError.statusCode === 401 || apiError.statusCode === 403
}

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
    path: '/',
  })
  const refreshToken = useCookie<string | null>(REFRESH_COOKIE, {
    maxAge: 60 * 60 * 24 * 30,
    sameSite: 'lax',
    path: '/',
  })

  let refreshPromise: Promise<AuthTokensResponse> | null = null
  let hydratePromise: Promise<void> | null = null

  const user = ref<AuthUser | null>(null)
  const profile = ref<StoreProfile | null>(null)
  const authUserState = useState<AuthUser | null>('store-auth-user', () => null)

  function syncAuthUserState() {
    authUserState.value = user.value
  }

  const isAuthenticated = computed(
    () => Boolean(accessToken.value && user.value),
  )

  function setSession(tokens: AuthTokensResponse) {
    accessToken.value = tokens.accessToken
    refreshToken.value = tokens.refreshToken
    user.value = tokens.user
    syncAuthUserState()
  }

  function clearSession() {
    accessToken.value = null
    refreshToken.value = null
    user.value = null
    profile.value = null
    syncAuthUserState()
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

  async function ensureFreshAccessToken(skewMs = 120_000) {
    if (!accessToken.value || !refreshToken.value) return

    if (!isAccessTokenExpiringSoon(accessToken.value, skewMs)) return

    await refreshSession()
  }

  async function refreshSession(): Promise<AuthTokensResponse> {
    if (!refreshToken.value) {
      throw new Error('No hay sesión activa')
    }

    if (refreshPromise) {
      return refreshPromise
    }

    refreshPromise = refreshStoreSession(refreshToken.value)
      .then((tokens) => {
        setSession(tokens)
        return tokens
      })
      .finally(() => {
        refreshPromise = null
      })

    return refreshPromise
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

    if (import.meta.client) {
      const queryClient = useQueryClient()
      queryClient.removeQueries({ queryKey: storeQueryKeys.all })
    }
  }

  async function fetchProfile() {
    profile.value = await fetchStoreProfile()
    user.value = profileToUser(profile.value)
    syncAuthUserState()
    return profile.value
  }

  function setTokensFromCallback(access: string, refresh: string) {
    accessToken.value = access
    refreshToken.value = refresh
    user.value = null
  }

  async function hydrateFromTokens() {
    if (user.value) {
      syncAuthUserState()
      return
    }

    if (!user.value && authUserState.value) {
      user.value = authUserState.value
      return
    }
    if (!accessToken.value && !refreshToken.value) return

    if (hydratePromise) {
      return hydratePromise
    }

    hydratePromise = (async () => {
      if (!accessToken.value && refreshToken.value) {
        try {
          await refreshSession()
        } catch {
          clearSession()
          return
        }
      }

      if (!accessToken.value) return

      try {
        await fetchProfile()
      } catch (error) {
        if (!isAuthFailure(error)) {
          return
        }

        if (!refreshToken.value) {
          clearSession()
          return
        }

        try {
          await refreshSession()
          await fetchProfile()
        } catch {
          clearSession()
        }
      }
    })().finally(() => {
      hydratePromise = null
    })

    return hydratePromise
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
    ensureFreshAccessToken,
    logout,
    fetchProfile,
    setTokensFromCallback,
    hydrateFromTokens,
  }
})
