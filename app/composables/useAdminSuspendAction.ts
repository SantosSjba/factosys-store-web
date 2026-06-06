type ConfirmVariant = 'danger' | 'primary'

export async function runAdminSuspendAction(options: {
  confirm: {
    title: string
    message: string
    confirmLabel: string
    variant?: ConfirmVariant
  }
  mutate: () => Promise<unknown>
  successMessage: string
}) {
  const { confirm } = useConfirm()
  const ok = await confirm({
    ...options.confirm,
    variant: options.confirm.variant ?? 'danger',
  })

  if (!ok) return

  try {
    await options.mutate()
    useToast().success(options.successMessage)
  } catch (error) {
    useToast().error(useApiErrorMessage(error))
  }
}
