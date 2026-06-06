export default defineNuxtRouteMiddleware(async (to) => {
  const adminAuth = useAdminAuthStore()

  if (!hasAdminSession(adminAuth)) return

  if (import.meta.server) return

  const isValid = await ensureAdminSession(adminAuth)
  if (isValid) {
    const redirect =
      typeof to.query.redirect === 'string' ? to.query.redirect : '/intranet'
    return navigateTo(redirect)
  }
})
