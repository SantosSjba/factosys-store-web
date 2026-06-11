export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()

  if (!hasStoreSession(authStore)) {
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath },
    })
  }

  await ensureStoreSession(authStore)

  if (!authStore.isAuthenticated && import.meta.client) {
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath },
    })
  }
})
