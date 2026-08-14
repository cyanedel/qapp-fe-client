import { env } from '@/config/env';
import type { User } from '@/types';

export const loginUser = async (email: string, password: string) => {
  const response = await fetch(`${env.API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Failed to login')
  }

  return data
}

export const getCurrentUser = async (userId: string): Promise<User> => {
  const response = await fetch(`${env.API_URL}/auth/me?user_id=${encodeURIComponent(userId)}`, {
    method: 'GET',
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Failed to load user profile')
  }

  return data.user ?? data
}
