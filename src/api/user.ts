const API_URL = import.meta.env.VITE_API_URL;

export const getUserAccessStatus = (collection_id: string, user_id: string) => {
  return fetch(`${API_URL}/collection/${collection_id}/access?user_id=${user_id}`)
      .then((res) => res.json())
      .catch((err) => {
        console.error('Access check failed:', err)
        return null;
      })
}