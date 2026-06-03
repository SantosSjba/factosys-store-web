export interface ApiErrorBody {
  statusCode: number
  code: string
  message: string
  details: string[] | Record<string, unknown> | null
  timestamp: string
  path: string
}

export class ApiError extends Error {
  readonly statusCode: number
  readonly code: string
  readonly details: ApiErrorBody['details']

  constructor(body: ApiErrorBody) {
    super(body.message)
    this.name = 'ApiError'
    this.statusCode = body.statusCode
    this.code = body.code
    this.details = body.details
  }
}

export function isApiErrorBody(value: unknown): value is ApiErrorBody {
  if (!value || typeof value !== 'object') return false
  const record = value as Record<string, unknown>
  return (
    typeof record.message === 'string' &&
    typeof record.statusCode === 'number'
  )
}
