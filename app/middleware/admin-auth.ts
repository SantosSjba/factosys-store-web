export default defineNuxtRouteMiddleware(async (to) => {
  const adminAuth = useAdminAuthStore()

  if (!hasAdminSession(adminAuth)) {
    return navigateTo({
      path: '/intranet/login',
      query: { redirect: to.fullPath },
    })
  }

  // SSR: hay cookies de sesión; la hidratación del usuario ocurre en el cliente
  if (import.meta.server) return

  const isValid = await ensureAdminSession(adminAuth)
  if (!isValid) {
    return navigateTo({
      path: '/intranet/login',
      query: { redirect: to.fullPath },
    })
  }
})
