const HEARTBEAT_INTERVAL_MS = 60_000

export default defineNuxtPlugin({
  name: 'store-presence',
  dependsOn: ['auth'],
  parallel: true,
  setup() {
    const authStore = useAuthStore()
    let timer: ReturnType<typeof setInterval> | undefined

    async function sendHeartbeat() {
      if (!authStore.isAuthenticated) return
      if (document.visibilityState !== 'visible') return

      try {
        await useApi().post('/store/presence/heartbeat')
      } catch {
        // La presencia es best-effort; no interrumpir la navegación del cliente.
      }
    }

    function startHeartbeat() {
      clearInterval(timer)
      void sendHeartbeat()
      timer = setInterval(() => {
        void sendHeartbeat()
      }, HEARTBEAT_INTERVAL_MS)
    }

    function stopHeartbeat() {
      clearInterval(timer)
      timer = undefined
    }

    watch(
      () => authStore.isAuthenticated,
      (isAuthenticated) => {
        if (isAuthenticated) {
          startHeartbeat()
        } else {
          stopHeartbeat()
        }
      },
      { immediate: true },
    )

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && authStore.isAuthenticated) {
        void sendHeartbeat()
      }
    })
  },
})
