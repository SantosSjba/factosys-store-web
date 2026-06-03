export default defineNuxtRouteMiddleware((to) => {
  const adminAuth = useAdminAuthStore()
  if (!adminAuth.isAuthenticated) {
    return navigateTo({
      path: '/intranet/login',
      query: { redirect: to.fullPath },
    })
  }
})
