import { env } from '@/config/env';

export const getScoreHistory = (user_id: string, collection_id: string) => {
  return fetch(`${env.API_URL}/user/history?user_id=${user_id}&collection_id=${collection_id}`)
      .then((res) => res.json())
      .then((data) => {
        return data["history"];
      })
      .catch((err) => {
        console.error('No Data:', err)
        return null;
      })
}