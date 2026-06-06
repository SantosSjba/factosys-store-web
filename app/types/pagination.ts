export type PaginationMeta = {
  page: number
  limit: number
  total: number
  totalPages: number
}

export type PaginatedResponse<T> = {
  items: T[]
  meta: PaginationMeta
}

export type PaginationParams = {
  page?: number
  limit?: number
  search?: string
}
