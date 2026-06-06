import { ApiError } from '~/types/api'
import { loginSchema } from '~/utils/validation/schemas'

type LoginMutation = {
  isPending: Ref<boolean>
  mutateAsync: (values: { email: string; password: string }) => Promise<unknown>
}

export function useAuthLoginSubmit(options: {
  mutation: LoginMutation
  redirectDefault: string
  contextMismatchSuffix: string
  successMessage?: string
  invalidMessage?: string
}) {
  const route = useRoute()
  const toast = useToast()

  const { createSubmitHandler, withMutationPending, setValues } = useApiForm({
    schema: loginSchema,
    initialValues: {
      email: '',
      password: '',
    },
  })

  const isSubmitting = withMutationPending(options.mutation)

  const onSubmit = createSubmitHandler(
    async (values) => {
      try {
        await options.mutation.mutateAsync(values)
        if (options.successMessage) {
          toast.success(options.successMessage)
        }
        const redirect =
          typeof route.query.redirect === 'string'
            ? route.query.redirect
            : options.redirectDefault
        await navigateTo(redirect)
      } catch (error) {
        if (error instanceof ApiError && error.code === 'EMAIL_NOT_VERIFIED') {
          toast.warning(
            'Tu cuenta aún no está verificada. Ingresa el código que enviamos a tu correo.',
          )
          await navigateTo({
            path: '/verify-email',
            query: { email: values.email },
          })
          return
        }

        let message = useApiErrorMessage(error)
        if (error instanceof ApiError && error.code === 'AUTH_CONTEXT_MISMATCH') {
          message += options.contextMismatchSuffix
        }
        toast.error(message)
      }
    },
    {
      invalidMessage:
        options.invalidMessage ?? 'Ingresa un correo y contraseña válidos.',
    },
  )

  return { onSubmit, isSubmitting, setValues }
}
