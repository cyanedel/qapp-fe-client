export interface ApiMessage {
  code: string
  message: string
}

export type ApiResponse<T extends object = object> = ApiMessage & T

export class ApiError extends Error {
  readonly code: string

  constructor(payload: unknown, fallbackMessage: string) {
    const data = payload as Partial<ApiMessage> | null
    super(typeof data?.message === 'string' ? data.message : fallbackMessage)
    this.name = 'ApiError'
    this.code = typeof data?.code === 'string' ? data.code : 'UNKNOWN_ERROR'
  }
}

export const throwApiError = (payload: unknown, fallbackMessage: string): never => {
  throw new ApiError(payload, fallbackMessage)
}

export const readApiResponse = async <T extends ApiMessage>(response: Response, fallbackMessage: string): Promise<T> => {
  const data = await response.json() as T
  if (!response.ok) {
    throw new ApiError(data, fallbackMessage)
  }
  return data
}
