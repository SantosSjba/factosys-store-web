import type { ConfirmOptions, ConfirmState } from '~/types/ui'

const defaultState = (): ConfirmState => ({
  open: false,
  loading: false,
  title: '',
  message: '',
  confirmLabel: 'Confirmar',
  cancelLabel: 'Cancelar',
  variant: 'primary',
})

export function useConfirm() {
  const state = useState<ConfirmState>('app-confirm', defaultState)

  function confirm(options: ConfirmOptions): Promise<boolean> {
    return new Promise((resolve) => {
      state.value = {
        ...defaultState(),
        ...options,
        open: true,
        loading: false,
        resolve,
      }
    })
  }

  function close(result: boolean) {
    state.value.resolve?.(result)
    state.value = defaultState()
  }

  function setLoading(loading: boolean) {
    state.value.loading = loading
  }

  return { state, confirm, close, setLoading }
}
