export function useStoreCart() {
  const authStore = useAuthStore()
  const router = useRouter()
  const route = useRoute()
  const toast = useToast()

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

  async function addToCart(variantId: string, quantity = 1) {
    if (!variantId) return

    if (!authStore.isAuthenticated) {
      await requireAuth()
      return
    }

    await addMutation.mutateAsync({ variantId, quantity })
  }

  async function updateQuantity(variantId: string, quantity: number) {
    if (!authStore.isAuthenticated) {
      await requireAuth()
      return
    }

    await updateMutation.mutateAsync({ variantId, quantity })
  }

  async function removeFromCart(variantId: string) {
    if (!authStore.isAuthenticated) return
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
  }
}
