import type { PaginatedResponse, PaginationParams } from '~/types/pagination'

export function usePaginatedAdminList<TItem>(
  useQueryFn: (
    params: ComputedRef<PaginationParams>,
  ) => {
    isPending: Ref<boolean>
    isError: Ref<boolean>
    error: Ref<unknown>
    data: Ref<PaginatedResponse<TItem> | undefined>
  },
  options?: { pageSize?: number },
) {
  const page = ref(1)
  const pageSize = ref(options?.pageSize ?? 10)
  const search = ref('')

  const queryParams = computed(() => ({
    page: page.value,
    limit: pageSize.value,
    search: search.value,
  }))

  const query = useQueryFn(queryParams)

  watch(search, () => {
    page.value = 1
  })

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
