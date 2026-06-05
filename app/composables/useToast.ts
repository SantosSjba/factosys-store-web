import type { ToastItem, ToastVariant } from '~/types/ui'

const TOASTS_KEY = 'app-toasts'

export function useToast() {
  const toasts = useState<ToastItem[]>(TOASTS_KEY, () => [])

  function remove(id: string) {
    toasts.value = toasts.value.filter((toast) => toast.id !== id)
  }

  function show(message: string, variant: ToastVariant = 'info', duration = 4000) {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    toasts.value = [...toasts.value, { id, message, variant, duration }]

    if (import.meta.client && duration > 0) {
      window.setTimeout(() => remove(id), duration)
    }

    return id
  }

  function success(message: string, duration?: number) {
    return show(message, 'success', duration)
  }

  function error(message: string, duration?: number) {
    return show(message, 'error', duration ?? 6000)
  }

  function warning(message: string, duration?: number) {
    return show(message, 'warning', duration)
  }

  function info(message: string, duration?: number) {
    return show(message, 'info', duration)
  }

  return { toasts, show, success, error, warning, info, remove }
}
