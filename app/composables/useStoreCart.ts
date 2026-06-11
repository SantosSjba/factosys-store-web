export function useStoreCart() {
  const authStore = useAuthStore()
  const router = useRouter()
  const route = useRoute()
  const toast = useToast()
  const { data: settings } = useStoreSettingsQuery()
  const guestCart = useGuestCartToken()

  const addMutation = useAddStoreCartItemMutation()
  const updateMutation = useUpdateStoreCartItemMutation()
  const removeMutation = useRemoveStoreCartItemMutation()

  async function requireAuth() {
    toast.info('Inicia sesión para usar el carrito.')
    await router.push({
      path: '/login',
      query: { redirect: route.fullPath },
    })
  }

  function canUseGuestCart() {
    return Boolean(settings.value?.guestCheckoutEnabled)
  }

  async function ensureCartAccess() {
    if (authStore.isAuthenticated) return true

    if (!canUseGuestCart()) {
      await requireAuth()
      return false
    }

    guestCart.ensure()
    return true
  }

  async function addToCart(variantId: string, quantity = 1) {
    if (!variantId) return
    if (!(await ensureCartAccess())) return

    await addMutation.mutateAsync({ variantId, quantity })
  }

  async function updateQuantity(variantId: string, quantity: number) {
    if (!(await ensureCartAccess())) return
    await updateMutation.mutateAsync({ variantId, quantity })
  }

  async function removeFromCart(variantId: string) {
    if (!(await ensureCartAccess())) return
    await removeMutation.mutateAsync(variantId)
  }

  const isAdding = computed(() => addMutation.isPending.value)
  const isUpdating = computed(() => updateMutation.isPending.value)

  return {
    addToCart,
    updateQuantity,
    removeFromCart,
    isAdding,
    isUpdating,
    canUseGuestCart,
  }
}
