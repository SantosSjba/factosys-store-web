const GUEST_CART_COOKIE = 'fs_guest_cart'

export function useGuestCartToken() {
  const token = useCookie<string | null>(GUEST_CART_COOKIE, {
    maxAge: 60 * 60 * 24 * 30,
    sameSite: 'lax',
    path: '/',
  })

  function ensure() {
    if (!token.value) {
      token.value = crypto.randomUUID()
    }
    return token.value
  }

  function clear() {
    token.value = null
  }

  return {
    token,
    ensure,
    clear,
    hasToken: computed(() => Boolean(token.value)),
  }
}
