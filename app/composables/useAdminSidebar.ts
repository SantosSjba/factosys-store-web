const SIDEBAR_MOBILE_KEY = 'admin-sidebar-mobile-open'
const SIDEBAR_COLLAPSED_STORAGE_KEY = 'fs-admin-sidebar-collapsed'

export function useAdminSidebar() {
  const mobileOpen = useState(SIDEBAR_MOBILE_KEY, () => false)
  const collapsed = useState('admin-sidebar-collapsed', () => false)

  if (import.meta.client) {
    onMounted(() => {
      const stored = localStorage.getItem(SIDEBAR_COLLAPSED_STORAGE_KEY)
      if (stored === 'true') collapsed.value = true
    })

    watch(collapsed, (value) => {
      localStorage.setItem(SIDEBAR_COLLAPSED_STORAGE_KEY, String(value))
    })
  }

  const contentOffsetClass = computed(() =>
    collapsed.value ? 'lg:pl-20' : 'lg:pl-[17rem]',
  )

  const sidebarWidthClass = computed(() =>
    collapsed.value ? 'w-20' : 'w-[17rem]',
  )

  function open() {
    mobileOpen.value = true
  }

  function close() {
    mobileOpen.value = false
  }

  function toggle() {
    mobileOpen.value = !mobileOpen.value
  }

  function toggleCollapsed() {
    collapsed.value = !collapsed.value
  }

  return {
    mobileOpen,
    collapsed,
    contentOffsetClass,
    sidebarWidthClass,
    open,
    close,
    toggle,
    toggleCollapsed,
  }
}
