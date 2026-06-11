export function useStoreFavorite(productId: MaybeRefOrGetter<string>) {
  const authStore = useAuthStore()
  const router = useRouter()

  const resolvedId = computed(() => toValue(productId).trim())
  const { data: favoriteIds } = useStoreFavoriteIdsQuery()
  const toggleMutation = useToggleStoreFavoriteMutation()
  const toast = useToast()

  const isFavorite = computed(() =>
    (favoriteIds.value ?? []).includes(resolvedId.value),
  )

  const isPending = computed(
    () =>
      toggleMutation.isPending.value &&
      toggleMutation.variables.value?.productId === resolvedId.value,
  )

  async function toggleFavorite() {
    if (!resolvedId.value) return

    if (!authStore.isAuthenticated) {
      toast.info('Inicia sesión para guardar favoritos.')
      await router.push({
        path: '/login',
        query: { redirect: useRoute().fullPath },
      })
      return
    }

    await toggleMutation.mutateAsync({
      productId: resolvedId.value,
      isFavorite: isFavorite.value,
    })
  }

  return {
    isFavorite,
    isPending,
    toggleFavorite,
  }
}
