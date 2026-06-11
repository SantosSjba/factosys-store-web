import { fetchStorePublicSettings } from '~/api/store-settings.api'

export default defineNuxtRouteMiddleware(async (to) => {
  const nuxtApp = useNuxtApp()
  const authStore = useAuthStore()

  if (hasStoreSession(authStore)) {
    await ensureStoreSession(authStore)
    if (authStore.isAuthenticated) return
  }

  const guestToken = useCookie('fs_guest_cart')

  const settings = await nuxtApp.runWithContext(() =>
    fetchStorePublicSettings(),
  )

  if (settings.guestCheckoutEnabled) {
    return
  }

  return navigateTo({
    path: '/login',
    query: { redirect: to.fullPath },
  })
})
