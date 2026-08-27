import { env } from '@/config/env';
import type { User } from '@/types/auth';
import { collectAccessLogInfo } from '@/lib/accessLogInfo';
import { ApiError, type ApiResponse, readApiResponse } from '@/api/response';

type AuthResponse = ApiResponse<{ user: User }>
type MeResponse = ApiResponse<{ user: User }>
type RenewalResult = 'renewed' | 'rejected' | 'unavailable'

export const AUTH_SESSION_EXPIRED_EVENT = 'potero-auth-session-expired'

let refreshPromise: Promise<RenewalResult> | null = null
let sessionAvailable = false
let lastActivityAt = Date.now()
let lastRefreshAt = 0

export class AuthError extends Error {
  readonly code: string

  constructor(message = 'Your session has expired. Please sign in again.', code = 'AUTH_INVALID_SESSION') {
    super(message)
    this.name = 'AuthError'
    this.code = code
  }
}

const notifySessionExpired = () => {
  sessionAvailable = false
  window.dispatchEvent(new Event(AUTH_SESSION_EXPIRED_EVENT))
}

const refreshSession = async (): Promise<RenewalResult> => {
  try {
    const response = await fetch(`${env.API_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    })
    if (response.ok) {
      sessionAvailable = true
      lastRefreshAt = Date.now()
      return 'renewed'
    }
    return response.status === 401 || response.status === 403 ? 'rejected' : 'unavailable'
  } catch {
    return 'unavailable'
  }
}

const renewSession = () => {
  if (!refreshPromise) {
    refreshPromise = refreshSession().finally(() => {
      refreshPromise = null
    })
  }
  return refreshPromise
}

export const authenticatedFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const requestInit = { ...init, credentials: 'include' as const }
  const response = await fetch(input, requestInit)
  if (response.status !== 401) return response

  const result = await renewSession()
  if (result === 'renewed') return fetch(input, requestInit)
  if (result === 'rejected') notifySessionExpired()
  return response
}

export const startSessionRenewal = () => {
  const recordActivity = () => {
    lastActivityAt = Date.now()
  }
  const activityEvents: Array<keyof WindowEventMap> = ['pointerdown', 'keydown', 'touchstart', 'scroll']
  activityEvents.forEach((eventName) => window.addEventListener(eventName, recordActivity, { passive: true }))

  const intervalID = window.setInterval(async () => {
    const now = Date.now()
    if (!sessionAvailable || document.visibilityState !== 'visible') return
    if (now - lastActivityAt > env.SESSION_ACTIVITY_WINDOW_MS) return
    if (now - lastRefreshAt < env.SESSION_REFRESH_INTERVAL_MS) return

    const result = await renewSession()
    if (result === 'rejected') notifySessionExpired()
  }, env.SESSION_ACTIVITY_POLL_MS)

  return () => {
    window.clearInterval(intervalID)
    activityEvents.forEach((eventName) => window.removeEventListener(eventName, recordActivity))
  }
}

export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await fetch(`${env.API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password, info: collectAccessLogInfo() }),
  })
  const data = await readApiResponse<AuthResponse>(response, 'Failed to login')
  sessionAvailable = true
  lastActivityAt = Date.now()
  lastRefreshAt = Date.now()
  return data
}

export const registerUser = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await fetch(`${env.API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  return readApiResponse<AuthResponse>(response, 'Failed to register account')
}

export const getCurrentUser = async (): Promise<User> => {
  const response = await authenticatedFetch(`${env.API_URL}/auth/me`, { method: 'GET' })
  const data = await response.json() as MeResponse
  if (!response.ok) {
    if (response.status === 401) {
      const error = new ApiError(data, 'Failed to load user profile')
      throw new AuthError(error.message, error.code)
    }
    throw new ApiError(data, 'Failed to load user profile')
  }
  sessionAvailable = true
  return data.user
}

export const validateCurrentSession = async (): Promise<User | null> => {
  try {
    return await getCurrentUser()
  } catch (err) {
    if (err instanceof AuthError) return null
    throw err
  }
}

export const logoutUser = async (): Promise<ApiResponse> => {
  const response = await fetch(`${env.API_URL}/auth/logout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ info: collectAccessLogInfo() }),
  })
  const data = await readApiResponse<ApiResponse>(response, 'Failed to logout')
  sessionAvailable = false
  return data
}
