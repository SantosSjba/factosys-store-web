const LOADING_KEY = 'app-loading'

export function useLoading() {
  const isLoading = useState(LOADING_KEY, () => false)
  const message = useState<string | null>('app-loading-message', () => null)

  function start(text?: string) {
    isLoading.value = true
    message.value = text ?? null
  }

  function stop() {
    isLoading.value = false
    message.value = null
  }

  async function wrap<T>(fn: () => Promise<T>, text?: string): Promise<T> {
    start(text)
    try {
      return await fn()
    } finally {
      stop()
    }
  }

  return { isLoading, message, start, stop, wrap }
}
