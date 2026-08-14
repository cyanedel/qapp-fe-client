import { env } from '@/config/env';
import { handleAuthResponse } from '@/api/auth';

export const getUserAccessStatus = (collection_id: string) => {
  return fetch(`${env.API_URL}/collection/${collection_id}/access`, {
    credentials: 'include',
  })
      .then((res) => {
        handleAuthResponse(res)
        return res.json()
      })
      .catch((err) => {
        console.error('Access check failed:', err)
        return null;
      })
}
