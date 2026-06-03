import axios from 'axios'
import { ApiError, isApiErrorBody } from '~/types/api'

export function parseApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error
  }

  if (axios.isAxiosError(error)) {
    if (isApiErrorBody(error.response?.data)) {
      return new ApiError(error.response.data)
    }

    return new ApiError({
      statusCode: error.response?.status ?? 500,
      code: 'UNKNOWN_ERROR',
      message: error.message || 'Error de conexión con el servidor',
      details: null,
      timestamp: new Date().toISOString(),
      path: error.config?.url ?? '',
    })
  }

  if (error instanceof Error) {
    return new ApiError({
      statusCode: 500,
      code: 'UNKNOWN_ERROR',
      message: error.message,
      details: null,
      timestamp: new Date().toISOString(),
      path: '',
    })
  }

  return new ApiError({
    statusCode: 500,
    code: 'UNKNOWN_ERROR',
    message: 'Error de conexión con el servidor',
    details: null,
    timestamp: new Date().toISOString(),
    path: '',
  })
}

export function normalizeApiError(error: unknown): never {
  throw parseApiError(error)
}
