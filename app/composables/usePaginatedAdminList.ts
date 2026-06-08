import type { PaginatedResponse, PaginationParams } from '~/types/pagination'

export function usePaginatedAdminList<TItem>(
  useQueryFn: (
    params: ComputedRef<PaginationParams & Record<string, unknown>>,
  ) => {
    isPending: Ref<boolean>
    isError: Ref<boolean>
    error: Ref<unknown>
    data: Ref<PaginatedResponse<TItem> | undefined>
  },
  options?: {
    pageSize?: number
    filters?: Ref<Record<string, unknown>>
  },
) {
  const page = ref(1)
  const pageSize = ref(options?.pageSize ?? 10)
  const search = ref('')

  const queryParams = computed(() => ({
    page: page.value,
    limit: pageSize.value,
    search: search.value,
    ...(options?.filters?.value ?? {}),
  }))

  const query = useQueryFn(queryParams)

  watch(search, () => {
    page.value = 1
  })

  if (options?.filters) {
    watch(options.filters, () => {
      page.value = 1
    }, { deep: true })
  }

  const isPending = computed(() => query.isPending.value)
  const isError = computed(() => query.isError.value)
  const error = computed(() => query.error.value)
  const items = computed(() => query.data.value?.items ?? [])
  const paginationMeta = computed(() => query.data.value?.meta)

  useQueryErrorToast(isError, error)

  return {
    page,
    pageSize,
    search,
    query,
    isPending,
    isError,
    error,
    items,
    paginationMeta,
  }
}
