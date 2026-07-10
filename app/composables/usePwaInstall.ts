const DISMISS_KEY = 'fs-pwa-install-dismissed'
const DISMISS_MS = 14 * 24 * 60 * 60 * 1000

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

function isStandaloneMode() {
  if (!import.meta.client) return false

  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}

function isDismissedRecently() {
  if (!import.meta.client) return true

  const raw = localStorage.getItem(DISMISS_KEY)
  if (!raw) return false

  const dismissedAt = Number(raw)
  if (!Number.isFinite(dismissedAt)) return false

  return Date.now() - dismissedAt < DISMISS_MS
}

function isIosInstallable() {
  if (!import.meta.client) return false

  const ua = window.navigator.userAgent
  const isIos = /iPad|iPhone|iPod/.test(ua)
  const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS/.test(ua)

  return isIos && isSafari
}

export function usePwaInstall() {
  const canPromptInstall = ref(false)
  const showIosGuide = ref(false)
  const isVisible = ref(false)
  const isInstalling = ref(false)

  let deferredPrompt: BeforeInstallPromptEvent | null = null

  function dismiss() {
    isVisible.value = false
    if (import.meta.client) {
      localStorage.setItem(DISMISS_KEY, String(Date.now()))
    }
  }

  async function install() {
    if (!deferredPrompt || isInstalling.value) return

    isInstalling.value = true
    try {
      await deferredPrompt.prompt()
      const choice = await deferredPrompt.userChoice
      deferredPrompt = null
      canPromptInstall.value = false

      if (choice.outcome === 'accepted') {
        isVisible.value = false
      }
    } finally {
      isInstalling.value = false
    }
  }

  onMounted(() => {
    if (isStandaloneMode() || isDismissedRecently()) return

    if (isIosInstallable()) {
      showIosGuide.value = true
      isVisible.value = true
      return
    }

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault()
      deferredPrompt = event as BeforeInstallPromptEvent
      canPromptInstall.value = true
      isVisible.value = true
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt)
    onUnmounted(() => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt)
    })
  })

  return {
    canPromptInstall,
    showIosGuide,
    isVisible,
    isInstalling,
    install,
    dismiss,
  }
}
