export default defineNuxtRouteMiddleware(() => {
  const adminAuth = useAdminAuthStore()
  if (adminAuth.isAuthenticated) {
    return navigateTo('/intranet')
  }
})
