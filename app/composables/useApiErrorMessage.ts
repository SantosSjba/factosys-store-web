import { ApiError } from '~/types/api'
import { parseApiError } from '~/utils/parse-api-error'

export function useApiErrorMessage(error: unknown): string {
  const apiError = error instanceof ApiError ? error : parseApiError(error)

  if (Array.isArray(apiError.details) && apiError.details.length > 0) {
    return `${apiError.message}: ${apiError.details.join(', ')}`
  }
  return apiError.message
}
