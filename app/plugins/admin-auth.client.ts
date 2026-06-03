export default defineNuxtPlugin(async () => {
  const adminAuth = useAdminAuthStore()
  if (adminAuth.accessToken && !adminAuth.user) {
    await adminAuth.hydrateFromTokens()
  }
})
