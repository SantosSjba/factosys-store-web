import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import type { z } from 'zod'

type SubmitConfig = {
  successMessage?: string
  onSuccess?: () => void | Promise<void>
  invalidMessage?: string
}

export function useApiForm<TSchema extends z.ZodTypeAny>(options: {
  schema: TSchema
  initialValues?: Partial<z.infer<TSchema>>
}) {
  const toast = useToast()

  const form = useForm({
    validationSchema: toTypedSchema(options.schema),
    initialValues: options.initialValues as Record<string, unknown>,
  })

  function createSubmitHandler(
    handler: (values: z.infer<TSchema>) => Promise<void>,
    config: SubmitConfig = {},
  ) {
    const invalidMessage =
      config.invalidMessage ?? 'Revisa los campos marcados en el formulario.'

    return form.handleSubmit(
      async (values) => {
        try {
          await handler(values as z.infer<TSchema>)
          if (config.successMessage) {
            toast.success(config.successMessage)
          }
          await config.onSuccess?.()
        } catch (error) {
          toast.error(useApiErrorMessage(error))
        }
      },
      () => {
        toast.warning(invalidMessage)
      },
    )
  }

  return {
    ...form,
    createSubmitHandler,
  }
}
