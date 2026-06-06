export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()

  if (!hasStoreSession(authStore)) {
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath },
    })
  }

  if (import.meta.server) return

  const isValid = await ensureStoreSession(authStore)
  if (!isValid) {
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath },
    })
  }
})
