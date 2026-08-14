import { env } from '@/config/env';
import { handleAuthResponse } from '@/api/auth';

export const getScoreHistory = (collection_id: string) => {
  return fetch(`${env.API_URL}/user/history?collection_id=${collection_id}`, {
    credentials: 'include',
  })
      .then((res) => {
        handleAuthResponse(res)
        return res.json()
      })
      .then((data) => {
        return data["history"];
      })
      .catch((err) => {
        console.error('No Data:', err)
        return null;
      })
}
