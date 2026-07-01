import { fetchStorePublicSettings } from '~/api/store-settings.api'

export default defineNuxtRouteMiddleware(async (to) => {
  const nuxtApp = useNuxtApp()
  const authStore = useAuthStore()

  if (hasStoreSession(authStore)) {
    await ensureStoreSession(authStore)
    if (authStore.isAuthenticated) return
  }

  let settings
  try {
    settings = await nuxtApp.runWithContext(() => fetchStorePublicSettings())
  } catch {
    return
  }

  if (settings.guestCheckoutEnabled) {
    return
  }

  return navigateTo({
    path: '/login',
    query: { redirect: to.fullPath },
  })
})
