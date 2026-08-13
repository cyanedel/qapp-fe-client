import { env } from '@/config/env';

export const getUserAccessStatus = (collection_id: string, user_id: string) => {
  return fetch(`${env.API_URL}/collection/${collection_id}/access?user_id=${user_id}`)
      .then((res) => res.json())
      .catch((err) => {
        console.error('Access check failed:', err)
        return null;
      })
}