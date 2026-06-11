const SESSION_ONCE_KEY = 'store-auth-session'

export function useStoreAuthSession() {
  return callOnce(SESSION_ONCE_KEY, async () => {
    const authStore = useAuthStore()

    if (hasStoreSession(authStore)) {
      await authStore.hydrateFromTokens()
    }
  })
}
