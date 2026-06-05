export type BreadcrumbItem = {
  label: string
  to?: string
}

export type ToastVariant = 'success' | 'error' | 'warning' | 'info'

export type ToastItem = {
  id: string
  message: string
  variant: ToastVariant
  duration: number
}

export type UiBadgeVariant =
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'

export type UiTabItem = {
  id: string
  label: string
  icon?: string
  disabled?: boolean
}

export type UiTableColumn<T = Record<string, unknown>> = {
  key: keyof T & string
  label: string
  align?: 'left' | 'center' | 'right'
  width?: string
}

export type ConfirmOptions = {
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'primary'
}

export type ConfirmState = ConfirmOptions & {
  open: boolean
  loading: boolean
  resolve?: (value: boolean) => void
}

export type UiSelectOption = {
  label: string
  value: string
  disabled?: boolean
}

export type UiChoiceOption = {
  label: string
  value: string
  hint?: string
  disabled?: boolean
}

export type UiCardTone = 'store' | 'admin'
export type UiCardVariant = 'elevated' | 'flat' | 'outline'
