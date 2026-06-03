import { defineStore } from 'pinia'
import {
  loginAdminUser,
  logoutAdminSession,
  refreshAdminSession,
} from '~/api/admin-auth.api'
import { fetchAdminProfile } from '~/api/admin-profile.api'
import type { AuthTokensResponse, LoginPayload, StoreProfile } from '~/types/auth'

const ACCESS_COOKIE = 'fs_admin_access_token'
const REFRESH_COOKIE = 'fs_admin_refresh_token'

export const useAdminAuthStore = defineStore('admin-auth', () => {
  const accessToken = useCookie<string | null>(ACCESS_COOKIE, {
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax',
  })
  const refreshToken = useCookie<string | null>(REFRESH_COOKIE, {
    maxAge: 60 * 60 * 24 * 30,
    sameSite: 'lax',
  })

  const user = ref<AuthTokensResponse['user'] | null>(null)
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

  async function login(payload: LoginPayload) {
    const tokens = await loginAdminUser(payload)
    setSession(tokens)
    return tokens
  }

  async function refreshSession(): Promise<AuthTokensResponse> {
    if (!refreshToken.value) {
      throw new Error('No hay sesión de intranet activa')
    }
    const tokens = await refreshAdminSession(refreshToken.value)
    setSession(tokens)
    return tokens
  }

  async function logout() {
    if (refreshToken.value) {
      try {
        await logoutAdminSession(refreshToken.value)
      } catch {
        // Cerrar sesión local aunque falle la API
      }
    }
    clearSession()
  }

  async function fetchProfile() {
    profile.value = await fetchAdminProfile()
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
    return profile.value
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

  const displayName = computed(() => {
    if (!user.value) return ''
    const parts = [user.value.firstName, user.value.lastName].filter(Boolean)
    return parts.length > 0 ? parts.join(' ') : user.value.email
  })

  return {
    accessToken,
    refreshToken,
    user,
    profile,
    isAuthenticated,
    displayName,
    setSession,
    clearSession,
    login,
    refreshSession,
    logout,
    fetchProfile,
    hydrateFromTokens,
  }
})
