export function useQueryErrorToast(
  isError: Ref<boolean> | ComputedRef<boolean>,
  error: Ref<unknown> | ComputedRef<unknown>,
) {
  const toast = useToast()

  watch(
    () => unref(isError),
    (failed) => {
      if (failed && unref(error)) {
        toast.error(useApiErrorMessage(unref(error)))
      }
    },
  )
}
