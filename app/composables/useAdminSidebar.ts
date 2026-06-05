const SIDEBAR_KEY = 'admin-sidebar-open'

export function useAdminSidebar() {
  const mobileOpen = useState(SIDEBAR_KEY, () => false)

  function open() {
    mobileOpen.value = true
  }

  function close() {
    mobileOpen.value = false
  }

  function toggle() {
    mobileOpen.value = !mobileOpen.value
  }

  return { mobileOpen, open, close, toggle }
}
