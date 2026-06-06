export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()

  if (!hasStoreSession(authStore)) return

  if (import.meta.server) return

  const isValid = await ensureStoreSession(authStore)
  if (isValid) {
    const redirect =
      typeof to.query.redirect === 'string' ? to.query.redirect : '/cuenta'
    return navigateTo(redirect)
  }
})
