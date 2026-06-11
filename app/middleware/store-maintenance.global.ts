import { fetchStorePublicSettings } from '~/api/store-settings.api'

const EXCLUDED_PREFIXES = [
  '/intranet',
  '/login',
  '/registro',
  '/verify-email',
  '/auth',
  '/mantenimiento',
]

export default defineNuxtRouteMiddleware(async (to) => {
  if (EXCLUDED_PREFIXES.some((prefix) => to.path.startsWith(prefix))) {
    return
  }

  const maintenanceState = useState<boolean | null>(
    'store-maintenance-mode',
    () => null,
  )

  if (maintenanceState.value === null) {
    try {
      const settings = await fetchStorePublicSettings()
      maintenanceState.value = settings.maintenanceMode
    } catch {
      maintenanceState.value = false
    }
  }

  if (maintenanceState.value && to.path !== '/mantenimiento') {
    return navigateTo('/mantenimiento')
  }
})
