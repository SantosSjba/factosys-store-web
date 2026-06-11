export function useCanUseStoreCart() {
  const authStore = useAuthStore()
  const { data: settings } = useStoreSettingsQuery()

  return computed(() => {
    if (authStore.isAuthenticated) return true
    return Boolean(settings.value?.guestCheckoutEnabled)
  })
}
