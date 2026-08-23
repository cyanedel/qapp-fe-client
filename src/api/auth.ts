import { env } from '@/config/env';
import type { User } from '@/types/auth';
import { collectAccessLogInfo } from '@/lib/accessLogInfo';
import { ApiError, type ApiResponse, readApiResponse } from '@/api/response';

type AuthResponse = ApiResponse<{ user: User }>
type MeResponse = ApiResponse<{ user: User }>

export const AUTH_SESSION_EXPIRED_EVENT = 'potero-auth-session-expired'

export class AuthError extends Error {
  readonly code: string

  constructor(message = 'Your session has expired. Please sign in again.', code = 'AUTH_INVALID_SESSION') {
    super(message)
    this.name = 'AuthError'
    this.code = code
  }
}

const notifySessionExpired = () => {
  window.dispatchEvent(new Event(AUTH_SESSION_EXPIRED_EVENT))
}

export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await fetch(`${env.API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ email, password, info: collectAccessLogInfo() }),
  })

  return readApiResponse<AuthResponse>(response, 'Failed to login')
}

export const registerUser = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await fetch(`${env.API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  })

  return readApiResponse<AuthResponse>(response, 'Failed to register account')
}

export const getCurrentUser = async (): Promise<User> => {
  const response = await fetch(`${env.API_URL}/auth/me`, {
    method: 'GET',
    credentials: 'include',
  })

  const data = await response.json() as MeResponse
  if (!response.ok) {
    if (response.status === 401) {
      const error = new ApiError(data, 'Failed to load user profile')
      throw new AuthError(error.message, error.code)
    }
    throw new ApiError(data, 'Failed to load user profile')
  }

  return data.user
}

export const validateCurrentSession = async (): Promise<User | null> => {
  try {
    return await getCurrentUser()
  } catch (err) {
    if (err instanceof AuthError) {
      return null
    }
    throw err
  }
}

export const handleAuthResponse = (response: Response) => {
  if (response.status === 401) {
    notifySessionExpired()
  }
}

export const logoutUser = async (): Promise<ApiResponse> => {
  const response = await fetch(`${env.API_URL}/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ info: collectAccessLogInfo() }),
  })

  return readApiResponse<ApiResponse>(response, 'Failed to logout')
}
