import { ApiError } from '~/types/api'

export function useApiErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (Array.isArray(error.details) && error.details.length > 0) {
      return `${error.message}: ${error.details.join(', ')}`
    }
    return error.message
  }
  if (error instanceof Error) {
    return error.message
  }
  return 'Ocurrió un error inesperado. Intenta de nuevo.'
}
