export type ThemeMode = 'light' | 'dark'

const THEME_STORAGE_KEY = 'fs-theme'

export function useTheme() {
  const theme = useState<ThemeMode>('app-theme', () => 'light')

  const isDark = computed(() => theme.value === 'dark')

  function applyTheme(mode: ThemeMode) {
    theme.value = mode
    if (import.meta.client) {
      document.documentElement.setAttribute('data-theme', mode)
      localStorage.setItem(THEME_STORAGE_KEY, mode)
    }
  }

  function toggleTheme() {
    applyTheme(theme.value === 'light' ? 'dark' : 'light')
  }

  function initTheme() {
    if (!import.meta.client) return

    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') {
      applyTheme(stored)
      return
    }

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    applyTheme(prefersDark ? 'dark' : 'light')
  }

  return { theme, isDark, applyTheme, toggleTheme, initTheme }
}
