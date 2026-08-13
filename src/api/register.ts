import { env } from '@/config/env';

export const registerUser = async (email: string, password: string) => {
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

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Failed to register account')
  }

  return data
}
