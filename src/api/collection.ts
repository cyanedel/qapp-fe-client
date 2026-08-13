import { env } from '@/config/env';

export const getCollectionList = () => {
  return fetch(API_URL + '/collection/list')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    }).then((data)=>{
      return data["data"]
    })
    .catch(err => {
      console.error('Fetch error:', err);
      return null;
    })
}

export const getCollectionByCollectionID = (collection_id: string) => {
  return fetch(`${env.API_URL}/collection/${collection_id}`)
    .then((res) => {
      if (!res.ok) throw new Error('Failed to fetch collection details')
      return res.json()
    })
    .then((data) => {
      return data['data'];
    })
    .catch((err) => {
      console.error('Fetch error:', err);
      return null;
    })
}

export const startQuestion = (collection_id: string, user_id: string) => {
  return fetch(`${env.API_URL}/quiz/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      collection_id: collection_id,
      user_id: user_id,
    }),
  }).then(
    res => res.json()
  ).then((data)=>{
    return data.attempt_id
  }).catch((err) => {
    console.error('Fetch error:', err);
    return null;
  })
}